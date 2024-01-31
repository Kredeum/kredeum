import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumberish } from "ethers";
import { constants } from "ethers";

import type { IOpenAutoMarket } from "@kredeum/contracts/types/index";
import { collectionGetContract } from "@kredeum/common/lib/collection/collection-get";
import { explorerTxLog } from "../common/config";
import { collectionIsAutoMarket } from "@kredeum/common/lib/collection/collection";

async function* buyNft(
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: BigNumberish
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, signer, nftPrice);

  if (!(chainId && address && address != constants.AddressZero && tokenID && nftPrice)) return {};

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
