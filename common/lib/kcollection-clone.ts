import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import type { NFTsFactory } from "./kfactory-get";

import { ethers, Signer } from "ethers";
import { getNetwork } from "./kconfig";
import { factoryGetContract } from "./kfactory-get";

const collectionCloneResponse = async (
  chainId: number,
  name: string,
  symbol: string,
  template: string,
  cloner: Signer
): Promise<TransactionResponse | undefined> => {
  // console.log("collectionCloneResponse", chainId, await cloner.getAddress());

  const network = getNetwork(chainId);

  const nftsFactory: NFTsFactory | undefined = factoryGetContract(chainId, cloner);
  let txResp: TransactionResponse | undefined;

  if (nftsFactory) {
    const n: string = (await nftsFactory.implementationsCount()).toString();

    txResp = await nftsFactory
      .connect(cloner)
      .clone(name || `Open NFTs #${n}`, symbol || `NFTs${n}`, template || "ownable");
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp.hash}`);
  } else {
    console.error("collectionCloneResponse nftsFactory not found");
  }

  return txResp;
};

const collectionCloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  let implementation = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = [
      "event NewImplementation(address indexed implementation, address indexed template, address indexed creator)"
    ];
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
  const txResp = await collectionCloneResponse(chainId, name, symbol, template, cloner);
  let address = "";
  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
