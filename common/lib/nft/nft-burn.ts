import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract, collectionBurnable } from "@lib/collection/collection-get";
import { providerGetSigner } from "@lib/common/provider-get";
import { explorerTxLog } from "../common/config";

const AddressdEaD = "0x000000000000000000000000000000000000dEaD";

async function* burnNft(
  chainId: number,
  address: string,
  tokenID: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  const signer = await providerGetSigner();
  if (!signer) return {};

  // console.log("burnNft", chainId, address, tokenID);

  if (!(chainId && address && tokenID)) return {};

  const { contract } = await collectionGetContract(chainId, address);
  contract.connect(signer);

  const burnFunction = await collectionBurnable(chainId, address);
  if (!burnFunction) return {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const txResp = (await contract[burnFunction](tokenID)) as TransactionResponse;
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { burnNft, AddressdEaD };
