import type { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, constants } from "ethers";
import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerUrl, explorerTxUrlLog } from "../common/kconfig";
import { IERC721 } from "@soltypes/index";

const getNftPrice = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> => {
  let price = BigNumber.from(0);

  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);
  if (collection.supports?.IOpenMarketable) {
    const openNFTsV4 = contract as OpenNFTsV4;
    price = await openNFTsV4.tokenPrice(BigNumber.from(tokenID));
    // price = ethers.utils.formatEther((await openNFTsV4.callStatic.tokenPrice(BigNumber.from(tokenID))).toString());
  }

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

  console.log("🚀 ~ file: kautomarket.ts ~ line 28 ~ contract", contract);

  if (!collection.supports?.IOpenMarketable)
    return { receiver: constants.AddressZero, royaltyAmount: BigNumber.from(0) };

  const [receiver, royaltyAmount] = await (contract as OpenNFTsV4).callStatic.royaltyInfo(
    BigNumber.from(tokenID),
    nftPrice
  );
  console.log("🚀 ~ file: kautomarket.ts ~ line 45 ~ royaltyAmount", royaltyAmount);

  return { receiver, royaltyAmount };
};

const getDefaultCollPrice = async (chainId: number, address: string, signer: JsonRpcSigner): Promise<string> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer.provider);

  if (!collection.supports?.IOpenMarketable) return "";

  return (await (contract as OpenNFTsV4).callStatic.defaultPrice()).toString();
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
    approved = await (contract as OpenNFTsV4).getApproved(tokenID);
    if (approved === constants.AddressZero) approved = "";
  }

  return approved;
};

const setApproveToken = async (
  chainId: number,
  address: string,
  tokenID: string,
  signer: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  if (!collection.supports?.IOpenMarketable) return;
  const txResp: TransactionResponse | undefined = await (contract as IERC721).approve(address, tokenID);

  explorerTxUrlLog(chainId, txResp?.hash);

  return txResp || undefined;
};

const approveNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const setTokenPrice = async (
  chainId: number,
  address: string,
  tokenID: string,
  tokenPrice: string,
  signer: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as OpenNFTsV4)["setTokenPrice(uint256,uint256)"](
    BigNumber.from(tokenID),
    tokenPrice
  );

  explorerTxUrlLog(chainId, txResp?.hash);

  return txResp;
};

const getEthersConverterLink = (chainId: number, price: string) => {
  let url = "";
  // https://etherscan.io/unitconverter?wei=0.0326
  url = explorerUrl(chainId, `/unitconverter?wei=${price}`);

  return url;
};

export {
  getNftPrice,
  getNftRoyaltyInfo,
  getDefaultCollPrice,
  getApproved,
  approveNftReceipt,
  setApproveToken,
  setTokenPrice,
  getEthersConverterLink
};
