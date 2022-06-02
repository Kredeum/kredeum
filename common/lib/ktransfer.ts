import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionContractGet } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const transferNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  destinationAddress: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | null> => {
  // console.log("transferNftResponse", chainId, address, tokenID, destinationAddress);

  let txResp: TransactionResponse | null = null;
  const network = getNetwork(chainId);

  if (!(chainId && address && tokenID && network && destinationAddress && owner)) return txResp;

  const ownerAddress = await owner.getAddress();
  // console.log("transferNftResponse owner", ownerAddress);

  const collectionContract = (await collectionContractGet(chainId, address, owner.provider)).connect(owner);
  // console.log("collectionContract", collectionContract);
  const transferERC721 = "safeTransferFrom(address,address,uint256)";
  const transferERC1155 = "safeTransferFrom(address,address,uint256,uint256,bytes)";

  if (collectionContract[transferERC721]) {
    const transferFunction = collectionContract[transferERC721] as {
      (from: string, to: string, tokenID: string): Promise<TransactionResponse>;
    };
    txResp = await transferFunction(ownerAddress, destinationAddress, tokenID);
  } else if (collectionContract[transferERC1155]) {
    const transferFunction = collectionContract[transferERC1155] as {
      (from: string, to: string, tokenID: string, amount: number, bytes: string): Promise<TransactionResponse>;
    };
    txResp = await transferFunction(ownerAddress, destinationAddress, tokenID, 1, "0x00");
  }
  console.log(`${network?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

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
): Promise<TransactionReceipt | null> => {
  // console.log("transferNft", chainId, address, tokenID, destinationAddress);

  const txResp = await transferNftResponse(chainId, address, tokenID, destinationAddress, owner);
  const txReceipt = txResp && (await transferNftReceipt(txResp));

  return txReceipt;
};

export { transferNft, transferNftResponse, transferNftReceipt };
