import type { IOpenMarketable } from "@kredeum/contracts/types/IOpenMarketable";
import type { IERC2981, IERC721 } from "@kredeum/contracts/types/index";

import { ADDRESS_ZERO } from "../common/config";

import type { ReceiverType } from "../common/types";
import { collectionGetContract } from "../collection/collection-get";
import { explorerUrl, isAddressNotZero } from "../common/config";
import { providerGetAccount, providerGetFallback } from "../common/provider-get";
import { collectionIsERC721, collectionIsOpenMarketable, collectionSupports } from "../collection/collection";

const getNftPrice = async (chainId: number, address: string, tokenID: string): Promise<bigint> => {
  let price = 0n;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (collectionIsOpenMarketable(collection))
    price = BigInt((await (contract as IOpenMarketable).getTokenPrice(BigInt(tokenID))).toString());

  return price;
};

const getNftRoyalty = async (chainId: number, address: string, tokenID: string): Promise<ReceiverType> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collectionIsOpenMarketable(collection)) return { account: ADDRESS_ZERO, fee: 0n };

  const receiver = await (contract as IOpenMarketable).getTokenRoyalty(tokenID);

  return {
    account: receiver.account,
    fee: BigInt(receiver.fee.toString()),
    minimum: BigInt(receiver.minimum.toString())
  };
};

// EIP-2981 royaltyInfo : https://eips.ethereum.org/EIPS/eip-2981
const getNftRoyaltyInfo = async (
  chainId: number,
  address: string,
  tokenID: string,
  nftPrice: string
): Promise<{ receiver: string; royaltyAmount: bigint }> => {
  const royalty = {
    receiver: ADDRESS_ZERO,
    royaltyAmount: 0n
  };

  const provider = await providerGetFallback(chainId);
  if (!provider) return royalty;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!collectionSupports(collection).get("IERC2981")) return royalty;

  const [receiver, amount] = await (contract as IERC2981).royaltyInfo(tokenID, nftPrice);
  royalty.receiver = receiver;
  royalty.royaltyAmount = BigInt(amount.toString());

  return royalty;
};

const getDefaultCollPrice = async (chainId: number, address: string): Promise<bigint> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  return collectionIsOpenMarketable(collection)
    ? BigInt((await (contract as IOpenMarketable).getMintPrice()).toString())
    : 0n;
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string
): Promise<{ receiver: string; fee: bigint }> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collectionIsOpenMarketable(collection)) return { receiver: ADDRESS_ZERO, fee: 0n };

  const royaltyInfostest = await (contract as IOpenMarketable).getDefaultRoyalty();

  return { receiver: royaltyInfostest[0], fee: BigInt(royaltyInfostest[1].toString()) };
};

const getApproved = async (chainId: number, address: string, tokenID: string): Promise<string> => {
  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!(contract && collectionIsERC721(collection))) return ADDRESS_ZERO;

  return await (contract as IERC721).getApproved(tokenID);
};

const isApprovedForAll = async (chainId: number, address: string, account?: string): Promise<boolean> => {
  if (!(account && isAddressNotZero(account))) account = await providerGetAccount();
  if (!isAddressNotZero(account)) return false;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!(contract && collectionIsERC721(collection))) return false;

  return await (contract as IERC721).isApprovedForAll(account, address);
};

const getEthersConverterLink = (chainId: number, price: string) => {
  let url = "";
  // https://etherscan.io/unitconverter?wei=0.0326
  url = explorerUrl(chainId, `/unitconverter?wei=${price}`);

  return url;
};

const getMax = (a: bigint = 0n, b: bigint = 0n): bigint => (BigInt(a) > b ? BigInt(a) : BigInt(b));

export {
  getNftPrice,
  getNftRoyalty,
  getNftRoyaltyInfo,
  getDefaultCollPrice,
  getDefaultCollRoyaltyInfos,
  getApproved,
  isApprovedForAll,
  getEthersConverterLink,
  getMax
};
