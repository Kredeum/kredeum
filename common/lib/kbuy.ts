import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "./kcollection-get";
import { getNetwork } from "./kconfig";

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

  const { contract, supports } = await collectionGetContract(chainId, address, buyer.provider);
  const connectedContract = contract.connect(buyer);

  if (supports.IOpenNFTsV4) {
    const buyOpenNftV4 = "buy(uint256)";
    const buyFunction = connectedContract[buyOpenNftV4] as {
      (tokenID: BigNumber, paymentSent: { value: string }): Promise<TransactionResponse>;
    };

    try {
      txResp = await buyFunction(BigNumber.from(tokenID), {
        value: ethers.utils.parseEther(nftPrice).toString()
      });
    } catch (e) {
      console.error("ERROR During buying", e);
      console.log(txResp);
    }
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
