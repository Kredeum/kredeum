import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionContractGet } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const burnNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | null> => {
  // console.log("burnNftResponse", chainId, address, tokenID, destinationAddress);

  let txResp: TransactionResponse | null = null;
  const network = getNetwork(chainId);

  if (!(chainId && address && tokenID && network && owner)) return txResp;

  const collectionContract = (await collectionContractGet(chainId, address, owner.provider)).connect(owner);

  const burnOpenNFT = "burnOpenNFT(uint256)";

  if (collectionContract[burnOpenNFT]) {
    const burnFunction = collectionContract[burnOpenNFT] as {
      (tokenID: string): Promise<TransactionResponse>;
    };
    txResp = await burnFunction(tokenID);
  }
  console.log(`${network?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

  return txResp;
};

const burnNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const burnNft = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner
): Promise<TransactionReceipt | null> => {
  // console.log("burnNft", chainId, address, tokenID, destinationAddress);

  const txResp = await burnNftResponse(chainId, address, tokenID, owner);
  const txReceipt = txResp && (await burnNftReceipt(txResp));

  return txReceipt;
};

export { burnNft, burnNftResponse, burnNftReceipt };
