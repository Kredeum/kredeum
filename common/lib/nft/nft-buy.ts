import type { TransactionResponse, TransactionReceipt } from "ethers";
import { ZeroAddress } from "ethers";

import type { IOpenAutoMarket } from "@soltypes/index";
import { collectionGetContract } from "@lib/collection/collection-get";
import { explorerTxLog } from "../common/config";

async function* buyNft(
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, signer, nftPrice);

  if (!(chainId && address && address != ZeroAddress && tokenID && nftPrice)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IOpenAutoMarket)) return {};

  const txResp: TransactionResponse | undefined = await (contract as unknown as IOpenAutoMarket).buy(tokenID, {
    value: String(nftPrice)
  });

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { buyNft };
