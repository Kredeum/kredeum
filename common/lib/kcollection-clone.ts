import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { ethers, Signer } from "ethers";
import { getNetwork } from "./kconfig";
import { factoryGetContract } from "./kfactory-get";

const collectionCloneResponse = async (
  chainId: number,
  name: string,
  symbol: string,
  template: string,
  cloner: Signer
): Promise<TransactionResponse> => {
  // console.log("collectionCloneResponse", chainId, name, symbol, template, await cloner.getAddress());

  const network = getNetwork(chainId);

  const nftsFactory = factoryGetContract(chainId, cloner);
  let txResp: TransactionResponse;
  // console.log("collectionCloneResponse", nftsFactory);

  const n: string = (await nftsFactory.implementationsCount()).toString();
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFTs${n}`;

  // only V2 has version
  if (nftsFactory.version) {
    txResp = await nftsFactory.connect(cloner).clone(_name, _symbol, template);
  } else {
    txResp = await nftsFactory.connect(cloner).clone(_name, _symbol);
  }
  console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp.hash}`);

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
  const txResp = await collectionCloneResponse(chainId, name, symbol, template, cloner);
  let address = "";
  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
