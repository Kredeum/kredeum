import type { IOpenMarketable } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenMarketable";
import type { IERC2981, IERC721 } from "@soltypes/index";

import { BigNumber, BigNumberish, constants } from "ethers";

import { collectionGetContract } from "@lib/collection/collection-get";
import { explorerUrl, MAX_FEE, config } from "@lib/common/config";
import { ReceiverType } from "@lib/common/types";
import { providerGetAccount, providerGetFallback } from "@lib/common/provider-get";

const getNftPrice = async (chainId: number, address: string, tokenID: string): Promise<BigNumber> => {
  let price = constants.Zero;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (collection.supports?.IOpenMarketable)
    price = await (contract as IOpenMarketable).getTokenPrice(BigNumber.from(tokenID));

  return price;
};

const getNftRoyalty = async (chainId: number, address: string, tokenID: string): Promise<ReceiverType> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collection.supports?.IOpenMarketable) return { account: constants.AddressZero, fee: 0 };

  const receiver = await (contract as IOpenMarketable).getTokenRoyalty(tokenID);

  return { account: receiver.account, fee: Number(receiver.fee), minimum: receiver.minimum };
};

// EIP-2981 royaltyInfo : https://eips.ethereum.org/EIPS/eip-2981
const getNftRoyaltyInfo = async (
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: string
): Promise<{ receiver: string; royaltyAmount: BigNumber }> => {
  const royalty = {
    receiver: constants.AddressZero,
    royaltyAmount: constants.Zero
  };

  const provider = await providerGetFallback(chainId);
  if (!provider) return royalty;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!collection.supports?.IERC2981) return royalty;

  [royalty.receiver, royalty.royaltyAmount] = await (contract as IERC2981).royaltyInfo(tokenID, nftPrice);

  return royalty;
};

const getDefaultCollPrice = async (chainId: number, address: string): Promise<BigNumber> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  return collection.supports?.IOpenMarketable ? await (contract as IOpenMarketable).getMintPrice() : constants.Zero;
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string
): Promise<{ receiver: string; fee: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, fee: constants.Zero };

  const royaltyInfostest = await (contract as IOpenMarketable).getDefaultRoyalty();

  return { receiver: royaltyInfostest[0], fee: royaltyInfostest[1] };
};

const getApproved = async (chainId: number, address: string, tokenID: string): Promise<string> => {
  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!(contract && collection.supports?.IERC721)) return constants.AddressZero;

  return await (contract as IERC721).getApproved(tokenID);
};

const isApprovedForAll = async (chainId: number, address: string, account?: string): Promise<boolean> => {
  account ||= await providerGetAccount();
  if (!account) return false;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!(contract && collection.supports?.IERC721)) return false;

  return await (contract as IERC721).isApprovedForAll(account, address);
};

const getEthersConverterLink = (chainId: number, price: string) => {
  let url = "";
  // https://etherscan.io/unitconverter?wei=0.0326
  url = explorerUrl(chainId, `/unitconverter?wei=${price}`);

  return url;
};

const getReceiverAmount = (price: BigNumberish = 0, fee = 0): BigNumber => BigNumber.from(price).mul(fee).div(MAX_FEE);

const isValidPrice = (price: BigNumberish = 0, minRoyaltyAmount: BigNumberish = 0): boolean =>
  BigNumber.from(price).gte(getReceiverAmount(price, config.treasury.fee).add(minRoyaltyAmount));

const getMax = (a: BigNumberish = 0, b: BigNumberish = 0): BigNumber =>
  BigNumber.from(a).gt(b) ? BigNumber.from(a) : BigNumber.from(b);

/////////////////////////////////////////////////////////////////////
// strig value of decimal number                    : "0.00153486726"
// strig value reduiced (defaul 5 decimals)         : "0.00153"
/////////////////////////////////////////////////////////////////////
const reduceDecimals = (value: string, decimals = 5): string => {
  const intgDecm: Array<string> = value.split(".");
  const intg = intgDecm.length >= 1 ? intgDecm[0] : "";
  const decm = intgDecm.length >= 2 ? intgDecm[1] : "";

  return decm.length > decimals ? `${intg}.${decm.slice(0, decimals - decm.length)}` : value;
};

export {
  getNftPrice,
  getNftRoyalty,
  getNftRoyaltyInfo,
  getDefaultCollPrice,
  getDefaultCollRoyaltyInfos,
  getApproved,
  isApprovedForAll,
  getEthersConverterLink,
  getReceiverAmount,
  isValidPrice,
  getMax,
  reduceDecimals
};
