import type { OpenAutoMarket } from "@soltypes/contracts/next/OpenAutoMarket";
import type { IOpenMarketable } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenMarketable";
import type { IERC2981, IERC721 } from "@soltypes/index";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, constants } from "ethers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerUrl, explorerTxLog } from "@lib/common/kconfig";

const getNftPrice = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> => {
  let price = BigNumber.from(0);

  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);
  if (collection.supports?.IOpenMarketable)
    price = await (contract as IOpenMarketable).getTokenPrice(BigNumber.from(tokenID));

  return price;
};

const getNftRoyaltyInfo = async (
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: string,
  signerOrProvider: Signer | Provider
): Promise<{ receiver: string; royaltyAmount: BigNumber } | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);
  if (!collection.supports?.IOpenMarketable)
    return { receiver: constants.AddressZero, royaltyAmount: BigNumber.from(0) };

  const [receiver, royaltyAmount] = await (contract as IERC2981).royaltyInfo(tokenID, nftPrice);

  return { receiver, royaltyAmount };
};

const getDefaultCollPrice = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  return collection.supports?.IOpenMarketable
    ? await (contract as IOpenMarketable).getDefaultPrice()
    : BigNumber.from(0);
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<{ receiver: string; fee: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, fee: BigNumber.from(0) };

  const royaltyInfostest = await (contract as IOpenMarketable).getDefaultRoyalty();

  return { receiver: royaltyInfostest[0], fee: royaltyInfostest[1] };
};

const getApproved = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider
): Promise<string> => {
  let approved = "";
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (collection.supports?.IOpenMarketable) {
    approved = await (contract as IERC721).getApproved(tokenID);
    if (approved === constants.AddressZero) approved = "";
  }

  return approved;
};

const isApprovedForAll = async (
  chainId: number,
  address: string,
  account: string,
  signerOrProvider: Signer | Provider
): Promise<boolean> => {
  let isApprovedForAll = false;
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (collection.supports?.IOpenMarketable) {
    isApprovedForAll = await (contract as IERC721).isApprovedForAll(account, address);
  }

  return isApprovedForAll;
};

async function* setTokenRoyaltyInfos(
  chainId: number,
  address: string,
  tokenID: string,
  fee: string,
  receiver: string,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenRoyaltyInfos", chainId, address, tokenID, fee, receiver, signer);

  if (!(chainId && address && tokenID && fee && receiver && signer)) return {};

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);
  if (!collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) return {};

  const txResp: TransactionResponse | undefined = await (contract as IOpenMarketable).setTokenRoyalty(
    BigNumber.from(tokenID),
    receiver,
    fee
  );

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setTokenApprove(
  chainId: number,
  address: string,
  tokenID: string,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && tokenID && signer)) return {};

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as IERC721).approve(address, tokenID);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setCollectionApproval(
  chainId: number,
  address: string,
  approval: boolean,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && approval && signer)) return {};

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as IERC721).setApprovalForAll(address, approval);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setTokenPrice(
  chainId: number,
  address: string,
  tokenID: string,
  tokenPrice: string,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, tokenPrice, signer);

  if (!(chainId && address && tokenID && tokenPrice && signer)) return {};

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);
  if (!collection.supports?.IOpenMarketable) return {};

  if (!collection.supports?.IOpenMarketable) return;

  const txResp = await (contract as IOpenMarketable).setTokenPrice(BigNumber.from(tokenID), tokenPrice);

  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

const getEthersConverterLink = (chainId: number, price: string) => {
  let url = "";
  // https://etherscan.io/unitconverter?wei=0.0326
  url = explorerUrl(chainId, `/unitconverter?wei=${price}`);

  return url;
};

async function* setDefautCollectionPrice(
  chainId: number,
  address: string,
  defaultPrice: BigNumber,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  console.log("setDefautCollectionPrice", chainId, address, defaultPrice, signer);
  if (!(chainId && address && defaultPrice && signer)) return;

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  console.log("setDefautCollectionPrice", collection);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp = await (contract as OpenAutoMarket).setDefaultPrice(defaultPrice);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setDefautCollectionRoyalty(
  chainId: number,
  address: string,
  defaultRoyaltiesReceiver: string,
  defaultRoyaltyAmount: BigNumber,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && defaultRoyaltyAmount && defaultRoyaltiesReceiver && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) {
    txResp = await (contract as IOpenMarketable).setDefaultRoyalty(defaultRoyaltiesReceiver, defaultRoyaltyAmount);
  }
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export {
  getNftPrice,
  getNftRoyaltyInfo,
  getDefaultCollPrice,
  getDefaultCollRoyaltyInfos,
  setTokenRoyaltyInfos,
  setDefautCollectionPrice,
  setDefautCollectionRoyalty,
  getApproved,
  isApprovedForAll,
  setTokenApprove,
  setCollectionApproval,
  setTokenPrice,
  getEthersConverterLink
};
