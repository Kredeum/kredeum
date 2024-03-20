import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import type { IOpenAutoMarket } from "@kredeum/contracts/types/index";
import { collectionGetContract } from "../collection/collection-get";
import { ADDRESS_ZERO, explorerTxLog } from "../common/config";
import { collectionIsAutoMarket } from "../collection/collection";
import { Address } from "viem";

async function* buyNft(
  chainId: number,
  address: Address,
  tokenID: string,
  nftPrice: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, signer, nftPrice);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && nftPrice)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collectionIsAutoMarket(collection))) return {};

  const txResp: TransactionResponse | undefined = await (contract as IOpenAutoMarket).buy(tokenID, {
    value: String(nftPrice)
  });

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { buyNft };
