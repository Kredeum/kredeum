import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerTxUrlLog, getExplorer } from "../common/kconfig";

const burnNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner,
  account: string
): Promise<TransactionResponse | null> => {
  // console.log("burnNftResponse", chainId, address, tokenID);

  let txResp: TransactionResponse | null = null;
  const network = getExplorer(chainId);

  if (!(chainId && address && tokenID && owner)) return txResp;

  const { contract, collection } = await collectionGetContract(chainId, address, owner);

  const connectedContract = contract.connect(owner);
  console.log("🚀 ~ file: kburn.ts ~ line 30 ~ connectedContract", connectedContract);

  const burnOpenNFT = "burn(uint256)";

  if (connectedContract[burnOpenNFT] && !collection.open && account === collection.owner) {
    const burnFunction = connectedContract[burnOpenNFT] as {
      (tokenID: string): Promise<TransactionResponse>;
    };
    txResp = await burnFunction(tokenID);
  }
  console.log(`${network || ""}/tx/${txResp?.hash || ""}`);

  return txResp;
};

const burnNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const burnNft = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner,
  account: string
): Promise<TransactionReceipt | null> => {
  // console.log("burnNft", chainId, address, tokenID, destinationAddress);

  const txResp = await burnNftResponse(chainId, address, tokenID, owner, account);
  explorerTxUrlLog(chainId, txResp?.hash);

  const txReceipt = txResp && (await burnNftReceipt(txResp));

  return txReceipt;
};

export { burnNft, burnNftResponse, burnNftReceipt };
