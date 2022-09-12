import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import type { Signer } from "@ethersproject/abstract-signer";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerTxLog } from "../common/kconfig";

async function* buyNft(
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: string,
  buyer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, nftPrice, signer);

  if (!(chainId && address && tokenID && nftPrice && buyer)) return {};

  const { contract, collection } = await collectionGetContract(chainId, address, buyer);
  // console.log("contract", contract);
  if (!collection.supports?.IOpenMarketable) return {};

  const buyFunction = contract["buy(uint256)"] as {
    (tokenID: string, paymentSent: { value: string }): Promise<TransactionResponse>;
  };

  const txResp: TransactionResponse | undefined = await buyFunction(tokenID, {
    value: nftPrice
  });

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { buyNft };
