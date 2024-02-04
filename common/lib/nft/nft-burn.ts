import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract, collectionBurnable } from "../collection/collection-get";
import { ADDRESS_ZERO } from "../common/config";
import { explorerTxLog } from "../common/config";

async function* burnNft(
  chainId: number,
  address: string,
  tokenID: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("burnNft", chainId, address, tokenID);
  if (!(chainId && address && address != ADDRESS_ZERO && tokenID)) return {};

  const { contract } = await collectionGetContract(chainId, address, true);
  if (!contract) return {};

  const burnFunction = await collectionBurnable(chainId, address);
  if (!burnFunction) return {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const txResp = (await contract[burnFunction](tokenID)) as TransactionResponse;
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { burnNft };
