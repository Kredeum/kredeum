import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { ethers } from "ethers";
import { explorerTxLog } from "@lib/common/kconfig";
import { factoryGetContract } from "@lib/common/kfactory-get";
import { resolverGetCount } from "@lib/resolver/resolver-get";

import abiOpenNFTsFactoryV3 from "@abis/contracts/next/OpenNFTsFactoryV3.sol/OpenNFTsFactoryV3.json";

const collectionCloneResponse = async (
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  // console.log("collectionCloneResponse", chainId, name, symbol, templateConfig, await cloner.getAddress());

  const nftsFactoryV3 = await factoryGetContract(chainId, cloner);

  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId, cloner.provider)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  const [template, config] = templateConfig.split("/");
  const options: boolean[] = [config == "generic"];

  // console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, options);
  const txResp = await nftsFactoryV3.clone(_name, _symbol, template, options);
  explorerTxLog(chainId, txResp);

  return txResp;
};

const collectionCloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  // let templateName = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    // const abi = [
    //   "event Clone(string indexed templateName, address indexed clone, string indexed name, string symbol, bool[] options)"
    // ];
    const iface = new ethers.utils.Interface(abiOpenNFTsFactoryV3);
    console.log(
      "🚀 ~ file: kcollection-clone.ts ~ line 48 ~ collectionCloneAddress ~ txReceipt.logs[0]",
      txReceipt.logs
    );
    const log = iface.parseLog(txReceipt.logs[0]);
    console.log("🚀 ~ file: kcollection-clone.ts ~ line 54 ~ collectionCloneAddress ~ log", log);

    // ({ templateName } = txReceipt.logs[0].address);
  }

  // console.log("collectionCloneAddress", implementation);
  return txReceipt.logs[0].address;
};

const collectionClone = async (
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): Promise<string> => {
  // console.log("collectionClone", chainId, name, symbol, templateConfig);

  let address = "";

  const txResp = await collectionCloneResponse(chainId, name, symbol, templateConfig, cloner);
  explorerTxLog(chainId, txResp);

  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    console.info("txReceipt", txReceipt);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
