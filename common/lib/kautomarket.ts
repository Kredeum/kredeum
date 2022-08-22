import type { OpenNFTsV4 } from "soltypes/contracts/templates/OpenNFTsV4";

import { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { Provider } from "@ethersproject/abstract-provider";
import { BigNumber, ethers } from "ethers";
import { collectionContractGet } from "lib/kcollection-get";
import { getExplorer } from "./kconfig";

const getNftPrice = async (chainId: number, address: string, tokenID: string, provider: Provider): Promise<string> => {
  let price = "";

  const { contract, supports } = await collectionContractGet(chainId, address, provider);
  if (supports.IOpenMarketable) {
    const openNFTsV4 = contract as OpenNFTsV4;
    price = ethers.utils.formatEther((await openNFTsV4.callStatic.tokenPrice(BigNumber.from(tokenID))).toString());
  }

  return price;
};

const getDefaultCollPrice = async (chainId: number, address: string, signer: JsonRpcSigner): Promise<string> => {
  const { contract, supports } = await collectionContractGet(chainId, address, signer.provider);

  if (!supports.IOpenMarketable) return "Token not marketable";
  console.log(
    "🚀 ~ file: kautomarket-get-metadata.ts ~ line 15 ~ getDefaultCollPrice ~ ethers.utils.formatEther(contract.defaultPrice())",
    ethers.utils.formatEther(await (contract as OpenNFTsV4).callStatic.defaultPrice())
  );
  return ethers.utils.formatEther(await (contract as OpenNFTsV4).callStatic.defaultPrice());
};

const setTokenPrice = async (
  chainId: number,
  address: string,
  signer: JsonRpcSigner,
  tokenID: string,
  tokenPrice: string
): Promise<TransactionReceipt | undefined> => {
  const { contract, supports } = await collectionContractGet(chainId, address, signer.provider);

  if (!supports.IOpenMarketable) return;
  const connectedContract = contract.connect(signer) as OpenNFTsV4;

  const txResp: TransactionResponse | undefined = await connectedContract["setTokenPrice(uint256,uint256)"](
    BigNumber.from(tokenID),
    ethers.utils.parseEther(tokenPrice).toString()
  );

  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

  const txReceipt = await txResp.wait();

  return txReceipt;
};

export { getNftPrice, getDefaultCollPrice, setTokenPrice };
