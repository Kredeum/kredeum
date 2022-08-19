import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";
import { collectionContractGet } from "lib/kcollection-get";

const getNftPrice = (chainId: number, address: string, tokenID: string): number => {
  const price = Number(tokenID);

  return price;
};

const getDefaultCollPrice = async (chainId: number, address: string, signer: JsonRpcSigner): Promise<string> => {
  const { contract, supports } = await collectionContractGet(chainId, address, signer.provider);

  if (!supports.IOpenMarketable) return "Token not marketable";
  console.log(
    "🚀 ~ file: kautomarket-get-metadata.ts ~ line 15 ~ getDefaultCollPrice ~ ethers.utils.formatEther(contract.defaultPrice())",
    ethers.utils.formatEther(await contract.callStatic.defaultPrice())
  );
  return ethers.utils.formatEther(await contract.callStatic.defaultPrice());
};

export { getNftPrice, getDefaultCollPrice };
