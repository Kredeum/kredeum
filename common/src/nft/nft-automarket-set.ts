import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import type { OpenAutoMarket } from "@kredeum/contracts/types/OpenAutoMarket";
import type { IOpenMarketable } from "@kredeum/contracts/types/IOpenMarketable";
import type { IERC721 } from "@kredeum/contracts/types/index";
import { collectionGetContract } from "../collection/collection-get";
import { ADDRESS_ZERO, explorerTxLog } from "../common/config";
import { collectionIsERC721, collectionIsOpenMarketable } from "../collection/collection";
import { type Address } from "viem";

async function* setTokenRoyaltyInfos(
  chainId: number,
  address: Address,
  tokenID: string,
  fee: string,
  receiver: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenRoyaltyInfos", chainId, address, tokenID, fee, receiver);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && fee && receiver)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return {};

  // console.log("contract", contract);
  if (!(collectionIsOpenMarketable(collection) && collection.open && signer === collection.owner)) return {};

  const txResp: TransactionResponse | undefined = await (contract as IOpenMarketable).setTokenRoyalty(
    BigInt(tokenID),
    receiver,
    fee
  );

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

async function* setTokenApprove(
  chainId: number,
  address: Address,
  tokenID: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collectionIsERC721(collection))) return {};

  const txResp = await (contract as IERC721).approve(address, tokenID);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setCollectionApproval(
  chainId: number,
  address: Address,
  approval: boolean
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ADDRESS_ZERO && approval)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collectionIsERC721(collection))) return;

  const txResp: TransactionResponse | undefined = await (contract as IERC721).setApprovalForAll(address, approval);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setTokenPrice(
  chainId: number,
  address: Address,
  tokenID: string,
  tokenPrice: bigint = 0n
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, tokenPrice);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && tokenPrice)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collectionIsOpenMarketable(collection))) return {};

  const txResp = await (contract as IOpenMarketable).setTokenPrice(tokenID, tokenPrice);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setDefautCollectionPrice(
  chainId: number,
  address: Address,
  mintPrice: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setDefautCollectionPrice", chainId, address, mintPrice);
  if (!(chainId && address && address != ADDRESS_ZERO && mintPrice)) return;

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collectionIsOpenMarketable(collection))) return {};

  const txResp = await (contract as OpenAutoMarket).setMintPrice(mintPrice);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setDefautCollectionRoyalty(
  chainId: number,
  address: Address,
  defaultRoyaltiesReceiver: string,
  defaultRoyaltyAmount: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ADDRESS_ZERO && defaultRoyaltyAmount && defaultRoyaltiesReceiver)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return {};

  if (!(collectionIsOpenMarketable(collection) && signer === collection.owner)) return {};

  const txResp = await (contract as IOpenMarketable).setDefaultRoyalty(defaultRoyaltiesReceiver, defaultRoyaltyAmount);
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export {
  setTokenRoyaltyInfos,
  setDefautCollectionPrice,
  setDefautCollectionRoyalty,
  setTokenApprove,
  setCollectionApproval,
  setTokenPrice
};
