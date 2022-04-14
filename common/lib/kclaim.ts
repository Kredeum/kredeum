import type { JsonRpcSigner } from "@ethersproject/providers";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { collectionContractGet } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const claimNftResponse = async (
  chainId: number,
  collectionAddress: string,
  tokenID: string,
  destinationAddress: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  // console.log("claimNftResponse", chainId, collectionAddress, tokenID, destinationAddress);

  let txResp: TransactionResponse | undefined;

  if (chainId && collectionAddress && tokenID && destinationAddress && owner) {
    const network = getNetwork(chainId);
    const ownerAddress = await owner.getAddress();
    // console.log("claimNftResponse owner", ownerAddress);

    const openNFTs = await collectionContractGet(chainId, collectionAddress, owner.provider);

    // console.log("claimFrom", ownerAddress, destinationAddress, tokenID);
    txResp = await openNFTs.connect(owner).claimFrom(ownerAddress, destinationAddress, tokenID);
    console.log(`${network?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);
  }

  return txResp;
};

const claimNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const claimNft = async (
  chainId: number,
  collectionAddress: string,
  tokenID: string,
  destinationAddress: string,
  owner: JsonRpcSigner
): Promise<TransactionReceipt | undefined> => {
  // console.log("claimNft", chainId, collectionAddress, tokenID, destinationAddress);

  const txResp = await claimNftResponse(chainId, collectionAddress, tokenID, destinationAddress, owner);
  const txReceipt = txResp && (await claimNftReceipt(txResp));

  return txReceipt;
};

export { claimNft, claimNftResponse, claimNftReceipt };
