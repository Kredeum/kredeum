import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "./kcollection-get";
import { getNetwork } from "./kconfig";
import { explorerTxUrlLog } from "./kconfig";

import { BigNumber } from "ethers";

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

  const { contract, collection } = await collectionGetContract(chainId, address, buyer);

  if (collection.supports?.IOpenNFTsV4) {
    const buyFunction = contract["buy(uint256)"] as {
      (tokenID: BigNumber, paymentSent: { value: BigNumber }): Promise<TransactionResponse>;
    };

    try {
      txResp = await buyFunction(BigNumber.from(tokenID), {
        value: BigNumber.from(nftPrice)
      });
    } catch (e) {
      console.error("ERROR During buying", e);
      console.log(txResp);
    }
  }
  explorerTxUrlLog(chainId, txResp?.hash);

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
  explorerTxUrlLog(chainId, txResp?.hash);

  const txReceipt = txResp && (await buyNftReceipt(txResp));

  return txReceipt;
};

export { buyNft, buyNftResponse, buyNftReceipt };
