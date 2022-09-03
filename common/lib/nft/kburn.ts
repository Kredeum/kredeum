import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerTxLog, getExplorer } from "../common/kconfig";

const burnNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner,
  account: string
): Promise<TransactionResponse | undefined> => {
  // console.log("burnNftResponse", chainId, address, tokenID);

  let txResp: TransactionResponse | undefined;

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
    explorerTxLog(chainId, txResp);
  }

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
): Promise<TransactionReceipt | undefined> => {
  // console.log("burnNft", chainId, address, tokenID, destinationAddress);

  const txResp = await burnNftResponse(chainId, address, tokenID, owner, account);
  explorerTxLog(chainId, txResp);

  const txReceipt = txResp && (await burnNftReceipt(txResp));

  return txReceipt;
};

export { burnNft, burnNftResponse, burnNftReceipt };
