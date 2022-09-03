import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { getNetwork } from "../common/kconfig";
import { explorerTxLog } from "../common/kconfig";

import { BigNumber } from "ethers";

const buyNftResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  buyer: JsonRpcSigner,
  nftPrice: string
): Promise<TransactionResponse | undefined> => {
  // console.log("transferNftResponse", chainId, address, tokenID, destinationAddress);

  let txResp: TransactionResponse | undefined = null;
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
      explorerTxLog(chainId, txResp);
    } catch (e) {
      console.error("ERROR During buying", e);
    }
  }

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
): Promise<TransactionReceipt | undefined> => {
  // console.log("transferNft", chainId, address, tokenID, destinationAddress);

  const txResp = await buyNftResponse(chainId, address, tokenID, owner, nftPrice);
  explorerTxLog(chainId, txResp);

  const txReceipt = txResp && (await buyNftReceipt(txResp));

  return txReceipt;
};

export { buyNft, buyNftResponse, buyNftReceipt };
