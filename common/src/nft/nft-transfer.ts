import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "../collection/collection-get";
import { ADDRESS_ZERO, explorerTxLog } from "../common/config";

import type { IERC721 } from "@kredeum/contracts/types/IERC721";
import type { IERC1155 } from "@kredeum/contracts/types/IERC1155";
import type { IOpenAutoMarket } from "@kredeum/contracts/types/IOpenAutoMarket";
import type { OpenAutoMarket } from "@kredeum/contracts/types/OpenAutoMarket";
import {
  collectionIsAutoMarket,
  collectionIsERC1155,
  collectionIsERC721,
  collectionRoyaltyEnforcement
} from "../collection/collection";
import { Address } from "viem";

async function* transferNft(
  chainId: number,
  address: Address,
  tokenID: string,
  from: string,
  to: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && to && from)) return {};
  // console.log("transferNft from", fromAddress);

  const { contract, collection } = await collectionGetContract(chainId, address, true);

  let txResp: TransactionResponse | undefined;
  if (collectionIsAutoMarket(collection)) {
    let minimumRoyalty = 0n;

    if (collectionRoyaltyEnforcement(collection)) {
      const [, , min] = await (contract as OpenAutoMarket).getTokenRoyalty(tokenID);
      minimumRoyalty = BigInt(min.toString());
    }
    // console.log("minimumRoyalty", minimumRoyalty);

    txResp = await (contract as IOpenAutoMarket).gift(to, tokenID, { value: String(minimumRoyalty) });
  } else if (collectionIsERC721(collection)) {
    // console.log("transferNft IERC721 safeTransferFrom", from, to, tokenID);
    txResp = await (contract as IERC721)["safeTransferFrom(address,address,uint256)"](from, to, tokenID);
  } else if (collectionIsERC1155(collection)) {
    txResp = await (contract as IERC1155).safeTransferFrom(from, to, tokenID, 1, "0x00");
  }
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { transferNft };
