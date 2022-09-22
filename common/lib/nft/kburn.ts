import type { IERC721 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC721";
import type { IERC1155 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC1155";
import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract, collectionBurnable } from "@lib/collection/kcollection-get";
import { explorerTxLog } from "../common/kconfig";

const AddressdEaD = "0x000000000000000000000000000000000000dEaD";

async function* burnNft(
  chainId: number,
  address: string,
  tokenID: string,
  signer: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  const account = await signer.getAddress();
  // console.log("burnNft", chainId, address, tokenID, account);

  if (!(chainId && address && tokenID && account)) return {};

  const { contract } = await collectionGetContract(chainId, address, signer);

  const burnFunction = await collectionBurnable(chainId, address, signer);
  if (!burnFunction) return {};

  const txResp = await contract[burnFunction](tokenID);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { burnNft, AddressdEaD };
