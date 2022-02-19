import type { Signer } from "ethers";
import type { Nft } from "./ktypes";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { collectionGet, collectionGetContract } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const transferNftResponse = async (
  chainId: number,
  collectionAddress: string,
  tokenID: string,
  destinationAddress: string,
  owner: Signer
): Promise<TransactionResponse | undefined> => {
  // console.log("transferNftResponse", chainId, collectionAddress, tokenID, destinationAddress);

  let txResp: TransactionResponse | null = null;

  if (chainId && collectionAddress && tokenID && destinationAddress && owner) {
    const network = getNetwork(chainId);
    const ownerAddress = await owner.getAddress();
    // console.log("transferNftResponse owner", ownerAddress);

    const openNFTs = await collectionGetContract(chainId, collectionAddress, owner);

    // console.log("transferFrom", ownerAddress, destinationAddress, tokenID);
    txResp = await openNFTs.connect(owner).transferFrom(ownerAddress, destinationAddress, tokenID);
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp?.hash}`);
  }

  return txResp;
};

const transferNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const transferNft = async (
  chainId: number,
  collectionAddress: string,
  tokenID: string,
  destinationAddress: string,
  owner: Signer
): Promise<TransactionReceipt | null> => {
  // console.log("transferNft", chainId, collectionAddress, tokenID, destinationAddress);

  const txResp = await transferNftResponse(chainId, collectionAddress, tokenID, destinationAddress, owner);
  const txReceipt = await transferNftReceipt(txResp);

  return txReceipt;
};

export { transferNft, transferNftResponse, transferNftReceipt };
