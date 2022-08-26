import type { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";

import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { Provider } from "@ethersproject/abstract-provider";
import { BigNumber, constants, ethers } from "ethers";
import { collectionGetContract } from "@lib/kcollection-get";
import { getExplorer } from "./kconfig";

const getNftPrice = async (chainId: number, address: string, tokenID: string, provider: Provider): Promise<string> => {
  let price = "";

  const { contract, supports } = await collectionGetContract(chainId, address, provider);
  if (supports.IOpenMarketable) {
    const openNFTsV4 = contract as OpenNFTsV4;
    price = ethers.utils.formatEther((await openNFTsV4.callStatic.tokenPrice(BigNumber.from(tokenID))).toString());
  }

  return price;
};

const getNftRoyaltyInfo = async (
  chainId: number,
  address: string,
  tokenID: string,
  provider: Provider
): Promise<{ receiver: string; royaltyAmount: string } | undefined> => {
  const { contract, supports } = await collectionGetContract(chainId, address, provider);

  console.log("🚀 ~ file: kautomarket.ts ~ line 28 ~ contract", contract);

  if (!supports.IOpenMarketable) return undefined;

  const [receiver, royaltyAmount] = await (contract as OpenNFTsV4).callStatic.royaltyInfo(
    BigNumber.from(tokenID),
    BigNumber.from("10000")
  );

  console.log("🚀 ~ file: kautomarket.ts ~ line 34 ~ { receiver, royaltyAmount }", receiver);
  const royaltyAmountEth = ethers.utils.formatEther(royaltyAmount).toString();

  return { receiver, royaltyAmount: royaltyAmountEth };
};

const getDefaultCollPrice = async (chainId: number, address: string, signer: JsonRpcSigner): Promise<string> => {
  const { contract, supports } = await collectionGetContract(chainId, address, signer.provider);

  if (!supports.IOpenMarketable) return "";

  return ethers.utils.formatEther(await (contract as OpenNFTsV4).callStatic.defaultPrice());
};

const checkApprouved = async (
  chainId: number,
  address: string,
  tokenID: string,
  provider: Provider
): Promise<string> => {
  let approved = "";
  const { contract, supports } = await collectionGetContract(chainId, address, provider);

  if (supports.IOpenMarketable) {
    approved = await (contract as OpenNFTsV4).callStatic.getApproved(tokenID);
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
  const { contract, supports } = await collectionGetContract(chainId, address, signer.provider);
  if (!supports.IOpenMarketable) return;
  const connectedContract = contract.connect(signer) as OpenNFTsV4;
  const txResp: TransactionResponse | undefined = await connectedContract["approve(address,uint256)"](
    address,
    BigNumber.from(tokenID)
  );

  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

  // let txReceipt;
  // if (txResp) txReceipt = await txResp.wait();

  return txResp || undefined;
};

const approveNftReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const setTokenPrice = async (
  chainId: number,
  address: string,
  signer: JsonRpcSigner,
  tokenID: string,
  tokenPrice: string
): Promise<TransactionResponse | undefined> => {
  const { contract, supports } = await collectionGetContract(chainId, address, signer.provider);

  if (!supports.IOpenMarketable) return;
  const connectedContract = contract.connect(signer) as OpenNFTsV4;

  const txResp: TransactionResponse | undefined = await connectedContract["setTokenPrice(uint256,uint256)"](
    BigNumber.from(tokenID),
    ethers.utils.parseEther(tokenPrice).toString()
  );

  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

  // const txReceipt = await txResp.wait();

  return txResp;
};

export {
  getNftPrice,
  getNftRoyaltyInfo,
  getDefaultCollPrice,
  checkApprouved,
  approveNftReceipt,
  setApproveToken,
  setTokenPrice
};
