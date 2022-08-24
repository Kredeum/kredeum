import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "@lib/kcollection-get";
import { getNetwork } from "@lib/kconfig";

import type { IERC721 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC721";
import type { IERC1155 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC1155";

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

  const { contract, supports } = await collectionGetContract(chainId, address, owner.provider);
  // console.log("contract", contract);

  if (supports.IERC721) {
    txResp = await (contract as IERC721)["safeTransferFrom(address,address,uint256)"](
      ownerAddress,
      destinationAddress,
      tokenID
    );
  } else if (supports.IERC1155) {
    txResp = await (contract as IERC1155).safeTransferFrom(ownerAddress, destinationAddress, tokenID, 1, "0x00");
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
