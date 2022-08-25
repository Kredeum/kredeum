import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { ethers } from "ethers";
import { getExplorer } from "@lib/kconfig";
import { factoryGetContract } from "@lib/kfactory-get";
import { resolverGetCount } from "@lib/resolver/resolver-get";

const collectionCloneResponse = async (
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  console.log("collectionCloneResponse", chainId, name, symbol, templateConfig, await cloner.getAddress());

  const nftsFactoryV3 = factoryGetContract(chainId, cloner);

  const n = (await resolverGetCount(chainId, cloner.provider)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFTs${n}`;

  const [template, config] = templateConfig.split("/");
  const options: boolean[] = [config == "generic"];

  console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, options);
  const txResp = await nftsFactoryV3.clone(_name, _symbol, template, options);

  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash}`);

  return txResp;
};

const collectionCloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  let implementation = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = ["event ImplementationNew(address indexed implementation, address indexed creator, uint256 index)"];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ implementation } = log.args);
  }

  // console.log("collectionCloneAddress", implementation);
  return implementation;
};

const collectionClone = async (
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): Promise<string> => {
  console.log("collectionClone", chainId, name, symbol, templateConfig);

  let address = "";

  const txResp = await collectionCloneResponse(chainId, name, symbol, templateConfig, cloner);
  console.log("txResp", txResp);

  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    console.log("txReceipt", txReceipt);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
