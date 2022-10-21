import type { OpenAutoMarket } from "@soltypes/contracts/next/OpenAutoMarket";
import type { IOpenMarketable } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenMarketable";
import type { IERC2981, IERC721 } from "@soltypes/index";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, BigNumberish, constants } from "ethers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerUrl, explorerTxLog, MAX_FEE, config } from "@lib/common/kconfig";
import { ReceiverType } from "@lib/common/ktypes";

const getNftPrice = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> => {
  let price = constants.Zero;

  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);
  if (collection.supports?.IOpenMarketable)
    price = await (contract as IOpenMarketable).getTokenPrice(BigNumber.from(tokenID));

  return price;
};

const getNftRoyalty = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider
): Promise<ReceiverType> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (!collection.supports?.IOpenMarketable) return { account: constants.AddressZero, fee: 0 };

  const receiver = await (contract as IOpenMarketable).getTokenRoyalty(tokenID);

  return { account: receiver.account, fee: Number(receiver.fee), minimum: receiver.minimum };
};

// EIP-2981 royaltyInfo : https://eips.ethereum.org/EIPS/eip-2981
const getNftRoyaltyInfo = async (
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: string,
  signerOrProvider: Signer | Provider
): Promise<{ receiver: string; royaltyAmount: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, royaltyAmount: constants.Zero };

  const [receiver, royaltyAmount] = await (contract as IERC2981).royaltyInfo(tokenID, nftPrice);

  return { receiver, royaltyAmount };
};

const getDefaultCollPrice = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  return collection.supports?.IOpenMarketable ? await (contract as IOpenMarketable).getMintPrice() : constants.Zero;
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<{ receiver: string; fee: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, fee: constants.Zero };

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
  signer: Signer,
  tokenPrice: BigNumberish = 0
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setTokenPrice", chainId, address, tokenID, tokenPrice, signer);

  if (!(chainId && address && tokenID && tokenPrice && signer)) return {};

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);
  if (!collection.supports?.IOpenMarketable) return {};

  if (!collection.supports?.IOpenMarketable) return;

  const txResp = await (contract as IOpenMarketable).setTokenPrice(tokenID, tokenPrice);

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
  mintPrice: BigNumber,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setDefautCollectionPrice", chainId, address, mintPrice, signer);
  if (!(chainId && address && mintPrice && signer)) return;

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("setDefautCollectionPrice", collection);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp = await (contract as OpenAutoMarket).setMintPrice(mintPrice);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setDefautCollectionRoyalty(
  chainId: number,
  address: string,
  defaultRoyaltiesReceiver: string,
  defaultRoyaltyAmount: BigNumberish,
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

const getReceiverAmount = (price: BigNumberish = 0, fee = 0): BigNumber => BigNumber.from(price).mul(fee).div(MAX_FEE);

const isValidPrice = (price: BigNumberish = 0, minRoyaltyAmount: BigNumberish = 0): boolean =>
  BigNumber.from(price).gt(getReceiverAmount(price, config.treasury.fee).add(minRoyaltyAmount)) ||
  BigNumber.from(price).eq(constants.Zero);

const getMax = (a: BigNumberish = 0, b: BigNumberish = 0): BigNumber =>
  BigNumber.from(a).gt(b) ? BigNumber.from(a) : BigNumber.from(b);

const getMinPrice = (minRoyalty: BigNumberish = 0): BigNumber => {
  if (MAX_FEE == config.treasury.fee) throw Error("Invalid treasury fee");
  else
    return BigNumber.from(minRoyalty)
      .mul(MAX_FEE)
      .div(MAX_FEE - config.treasury.fee);
};

const reduceDecimals = (value: string, decimals: number): string => {
  return value.includes(".") && value.split(".").length === 2
    ? `${value.split(".")[0]}.${value.split(".")[1].slice(0, -(value.split(".")[1].length - decimals))}`
    : "";
};

export {
  getNftPrice,
  getNftRoyalty,
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
  getEthersConverterLink,
  getReceiverAmount,
  isValidPrice,
  getMax,
  getMinPrice,
  reduceDecimals
};
