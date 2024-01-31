import type { IOpenMarketable } from "@kredeum/contracts/types/IOpenMarketable";
import type { IERC2981, IERC721 } from "@kredeum/contracts/types/index";
import type { BigNumberish } from "ethers";
import { BigNumber, constants } from "ethers";

import type { ReceiverType } from "@kredeum/common/lib/common/types";
import { collectionGetContract } from "@kredeum/common/lib/collection/collection-get";
import { explorerUrl, isAddressNotZero } from "@kredeum/common/lib/common/config";
import { providerGetAccount, providerGetFallback } from "@kredeum/common/lib/common/provider-get";
import {
  collectionIsERC721,
  collectionIsOpenMarketable,
  collectionSupports
} from "@kredeum/common/lib/collection/collection";

const getNftPrice = async (chainId: number, address: string, tokenID: string): Promise<BigNumber> => {
  let price = constants.Zero;

  const { contract, collection } = await collectionGetContract(chainId, address);
  if (collectionIsOpenMarketable(collection))
    price = await (contract as IOpenMarketable).getTokenPrice(BigNumber.from(tokenID));

  return price;
};

const getNftRoyalty = async (chainId: number, address: string, tokenID: string): Promise<ReceiverType> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collectionIsOpenMarketable(collection)) return { account: constants.AddressZero, fee: 0 };

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
  if (!collectionSupports(collection).get("IERC2981")) return royalty;

  [royalty.receiver, royalty.royaltyAmount] = await (contract as IERC2981).royaltyInfo(tokenID, nftPrice);

  return royalty;
};

const getDefaultCollPrice = async (chainId: number, address: string): Promise<BigNumber> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  return collectionIsOpenMarketable(collection) ? await (contract as IOpenMarketable).getMintPrice() : constants.Zero;
};

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string
): Promise<{ receiver: string; fee: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address);

  if (!collectionIsOpenMarketable(collection)) return { receiver: constants.AddressZero, fee: constants.Zero };

  const royaltyInfostest = await (contract as IOpenMarketable).getDefaultRoyalty();

  return { receiver: royaltyInfostest[0], fee: royaltyInfostest[1] };
};

const getApproved = async (chainId: number, address: string, tokenID: string): Promise<string> => {
  const { contract, collection } = await collectionGetContract(chainId, address);
  if (!(contract && collectionIsERC721(collection))) return constants.AddressZero;

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

const getMax = (a: BigNumberish = 0, b: BigNumberish = 0): BigNumber =>
  BigNumber.from(a).gt(b) ? BigNumber.from(a) : BigNumber.from(b);

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
