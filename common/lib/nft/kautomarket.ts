import type { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";
import { IERC721 } from "@soltypes/index";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, constants, ethers } from "ethers";
import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerUrl, explorerTxLog } from "../common/kconfig";

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

const getDefaultCollRoyaltyInfos = async (
  chainId: number,
  address: string,
  signer: JsonRpcSigner
): Promise<{ receiver: string; fraction: BigNumber }> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer.provider);

  if (!collection.supports?.IOpenMarketable) return { receiver: constants.AddressZero, fraction: BigNumber.from(0) };

  const royaltyInfostest = await (contract as OpenNFTsV4).callStatic.getDefaultRoyaltyInfo();

  return { receiver: royaltyInfostest[0], fraction: royaltyInfostest[1] };
};

const setTokenRoyaltyInfos = async (
  chainId: number,
  address: string,
  tokenID: string,
  fee: number,
  receiver: string,
  signer: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signer);

  if (!collection.supports?.IOpenMarketable) return;

  const txResp: TransactionResponse | undefined = await (contract as OpenNFTsV4).setTokenRoyalty(
    BigNumber.from(tokenID),
    receiver,
    fee
  );

  explorerTxLog(chainId, txResp);

  return txResp;
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

  explorerTxLog(chainId, txResp);

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
  signer: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && defaultPrice && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) {
    txResp = await (contract as OpenNFTsV4).setDefaultPrice(ethers.utils.parseEther(defaultPrice));
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
  signer: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && defaultRoyaltyAmount && defaultRoyaltiesReceiver && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  if (collection.supports?.IOpenMarketable && !collection.open && account === collection.owner) {
    txResp = await (contract as OpenNFTsV4).setDefaultRoyalty(
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
  approveNftReceipt,
  setApproveToken,
  setTokenPrice,
  getEthersConverterLink
};
