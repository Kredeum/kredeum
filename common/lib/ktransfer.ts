import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionContractGet } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const transferNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  destinationAddress: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  // console.log("transferNftResponse", chainId, address, tokenID, destinationAddress);

  let txResp: TransactionResponse | undefined;

  if (chainId && address && tokenID && destinationAddress && owner) {
    const network = getNetwork(chainId);
    const ownerAddress = await owner.getAddress();
    // console.log("transferNftResponse owner", ownerAddress);

    const openNFTs = await collectionContractGet(chainId, address, owner.provider);

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
  address: string,
  tokenID: string,
  destinationAddress: string,
  owner: JsonRpcSigner
): Promise<TransactionReceipt | undefined> => {
  // console.log("transferNft", chainId, address, tokenID, destinationAddress);

  const txResp = await transferNftResponse(chainId, address, tokenID, destinationAddress, owner);
  const txReceipt = txResp && (await transferNftReceipt(txResp));

  return txReceipt;
};

export { transferNft, transferNftResponse, transferNftReceipt };
