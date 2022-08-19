import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionContractGet } from "@lib/kcollection-get";
import { getNetwork } from "@lib/kconfig";

// import type { IERC721 } from "soltypes/contracts/interfaces/IERC721";
// import type { IERC1155 } from "soltypes/contracts/interfaces/IERC1155";
import { IOpenNFTsV4 } from "@soltypes/contracts/interfaces/IOpenNFTsV4";
import { BigNumber, ethers } from "ethers";

const buyNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  buyer: JsonRpcSigner,
  nftPrice: string
): Promise<TransactionResponse | null> => {
  // console.log("transferNftResponse", chainId, address, tokenID, destinationAddress);

  let txResp: TransactionResponse | null = null;
  const network = getNetwork(chainId);

  if (!(chainId && address && tokenID && network && buyer)) return txResp;

  // const buyerAddress = await buyer.getAddress();
  // console.log("transferNftResponse buyer", buyerAddress);

  const { contract, supports } = await collectionContractGet(chainId, address, buyer.provider);
  // console.log("contract", contract);
  const connectedContract = contract.connect(buyer);
  if (supports.IOpenNFTsV4) {
    txResp = await (connectedContract as IOpenNFTsV4)["buy(uint256)"](BigNumber.from(tokenID), {
      value: ethers.utils.parseEther(nftPrice).toString()
    });
  }
  console.log(`${network?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

  return txResp;
};

const buyNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const buyNft = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner,
  nftPrice: string
): Promise<TransactionReceipt | null> => {
  // console.log("transferNft", chainId, address, tokenID, destinationAddress);

  const txResp = await buyNftResponse(chainId, address, tokenID, owner, nftPrice);
  const txReceipt = txResp && (await buyNftReceipt(txResp));

  return txReceipt;
};

export { buyNft, buyNftResponse, buyNftReceipt };
