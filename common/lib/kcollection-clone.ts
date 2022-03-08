import type { Provider, TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import type { NFTsFactory } from "types/NFTsFactory";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import { ethers, Signer } from "ethers";
import { getNetwork } from "./kconfig";
import { factoryGetContract } from "./kfactory-get";

const _cloneParams = async (nftsFactory: NFTsFactoryV2, name: string, symbol: string) => {
  const n = (await nftsFactory.implementationsCount()).toString();
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFTs${n}`;
  return { _name, _symbol };
};

const collectionCloneResponse = async (
  chainId: number,
  name: string,
  symbol: string,
  template: string,
  cloner: Signer
): Promise<TransactionResponse | undefined> => {
  // console.log("collectionCloneResponse", chainId, name, symbol, template, await cloner.getAddress());

  const network = getNetwork(chainId);

  const nftsFactoryV2 = factoryGetContract(chainId, cloner) as NFTsFactoryV2;

  const { _name, _symbol } = await _cloneParams(nftsFactoryV2, name, symbol);
  const options: boolean[] = template == "ownable" ? [false, true] : [true, false];
  // console.log("nftsFactoryV2", _name, _symbol, template, options);

  const txResp = await nftsFactoryV2.connect(cloner).clone(_name, _symbol, "OpenNFTsV3", options);
  console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp?.hash}`);

  return txResp;
};

const collectionCloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  let implementation = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = ["event ImplementationNew(address indexed implementation, address indexed creator, uint256 count)"];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ implementation } = log.args);
  }

  //  console.log("collectionCloneAddress", implementation);
  return implementation;
};

const collectionClone = async (
  chainId: number,
  name: string,
  symbol: string,
  template: string,
  cloner: Signer
): Promise<string> => {
  let address = "";

  const txResp = await collectionCloneResponse(chainId, name, symbol, template, cloner);
  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
