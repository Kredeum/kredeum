import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, constants } from "ethers";

import type { IOpenMarketable } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenMarketable";
import type { IERC2981, IERC721 } from "@soltypes/index";

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
    price = await (contract as IOpenMarketable).tokenPrice(BigNumber.from(tokenID));

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

  return collection.supports?.IOpenMarketable ? await (contract as IOpenMarketable).defaultPrice() : BigNumber.from(0);
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<{ receiver: string; fee: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, fee: BigNumber.from(0) };

  const royaltyInfostest = await (contract as IOpenMarketable).getDefaultRoyaltyInfo();

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

const setTokenRoyaltyInfos = async (
  chainId: number,
  address: string,
  tokenID: string,
  fee: number,
  receiver: string,
  signer: Signer
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as IOpenMarketable).setTokenRoyalty(
    BigNumber.from(tokenID),
    receiver,
    fee
  );

  explorerTxLog(chainId, txResp);

  return txResp;
};

const setApproveToken = async (
  chainId: number,
  address: string,
  tokenID: string,
  signer: Signer
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  if (!collection.supports?.IOpenMarketable) return;
  const txResp: TransactionResponse | undefined = await (contract as IERC721).approve(address, tokenID);

  explorerTxLog(chainId, txResp);

  return txResp || undefined;
};

const setTokenPrice = async (
  chainId: number,
  address: string,
  tokenID: string,
  tokenPrice: string,
  signer: Signer
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as IOpenMarketable)["setTokenPrice(uint256,uint256)"](
    BigNumber.from(tokenID),
    tokenPrice
  );

  explorerTxLog(chainId, txResp);

  return txResp;
};

const getEthersConverterLink = (chainId: number, price: string) => {
  let url = "";
  // https://etherscan.io/unitconverter?wei=0.0326
  url = explorerUrl(chainId, `/unitconverter?wei=${price}`);

  return url;
};

async function* setDefautCollectionPrice(
  chainId: number,
  address: string,
  defaultPrice: string,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("setdefaultcollprice", chainId, address, defaultPrice, signer);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && defaultPrice && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) {
    txResp = await (contract as IOpenMarketable).setDefaultPrice(defaultPrice);
  }
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* setDefautCollectionRoyalty(
  chainId: number,
  address: string,
  defaultRoyaltiesReceiver: string,
  defaultRoyaltyAmount: string,
  signer: Signer
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && defaultRoyaltyAmount && defaultRoyaltiesReceiver && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) {
    txResp = await (contract as IOpenMarketable).setDefaultRoyalty(
      defaultRoyaltiesReceiver,
      BigNumber.from(defaultRoyaltyAmount)
    );
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
  setApproveToken,
  setTokenPrice,
  getEthersConverterLink
};
