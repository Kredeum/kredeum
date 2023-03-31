import { TransactionResponse, TransactionReceipt, ContractTransactionResponse } from "ethers";

import type { OpenAutoMarket } from "@soltypes/src/OpenAutoMarket";
import type { IOpenMarketable } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenMarketable";
import type { IERC721 } from "@soltypes/index";
import { collectionGetContract } from "@lib/collection/collection-get";
import { explorerTxLog } from "@lib/common/config";
import { ZeroAddress } from "ethers";

async function* setTokenRoyaltyInfos(
  chainId: number,
  address: string,
  tokenID: string,
  fee: string,
  receiver: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenRoyaltyInfos", chainId, address, tokenID, fee, receiver);

  if (!(chainId && address && address != ZeroAddress && tokenID && fee && receiver)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return {};

  // console.log("contract", contract);
  if (!(collection.supports?.IOpenMarketable && collection.open && signer === collection.owner)) return {};

  const txResp: TransactionResponse | undefined = await (contract as unknown as IOpenMarketable).setTokenRoyalty(
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
  address: string,
  tokenID: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ZeroAddress && tokenID)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IERC721)) return {};

  const txResp = await (contract as unknown as IERC721).approve(address, tokenID);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

async function* setCollectionApproval(
  chainId: number,
  address: string,
  approval: boolean
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ZeroAddress && approval)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IERC721)) return;

  const txResp: TransactionResponse | undefined = await (contract as unknown as IERC721).setApprovalForAll(
    address,
    approval
  );

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

async function* setTokenPrice(
  chainId: number,
  address: string,
  tokenID: string,
  tokenPrice = 0n
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  if (!(chainId && address && address != ZeroAddress && tokenID)) return {};
  // console.log("setTokenPrice", chainId, address, tokenID, tokenPrice);

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IOpenMarketable)) return {};

  let txResp: ContractTransactionResponse | undefined;
  try {
    txResp = (await contract.setTokenPrice(tokenID, tokenPrice)) as ContractTransactionResponse;
  } catch (e) {
    console.error(e);
  }

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

async function* setDefautCollectionPrice(
  chainId: number,
  address: string,
  mintPrice: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setDefautCollectionPrice", chainId, address, mintPrice);
  if (!(chainId && address && address != ZeroAddress && mintPrice)) return;

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IOpenMarketable)) return {};

  const txResp = await (contract as unknown as OpenAutoMarket).setMintPrice(mintPrice);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

async function* setDefautCollectionRoyalty(
  chainId: number,
  address: string,
  defaultRoyaltiesReceiver: string,
  defaultRoyaltyAmount: bigint
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && address != ZeroAddress && defaultRoyaltyAmount && defaultRoyaltiesReceiver)) return {};

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer && collection.supports?.IOpenMarketable)) return {};

  if (!(collection.supports?.IOpenMarketable && collection.royalty && signer === collection.owner)) return {};

  const txResp = await (contract as unknown as IOpenMarketable).setDefaultRoyalty(
    defaultRoyaltiesReceiver,
    defaultRoyaltyAmount
  );
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield (await txResp.wait()) || {};
}

export {
  setTokenRoyaltyInfos,
  setDefautCollectionPrice,
  setDefautCollectionRoyalty,
  setTokenApprove,
  setCollectionApproval,
  setTokenPrice
};
