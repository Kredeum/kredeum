import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { ethers, Signer } from "ethers";
import { getNetwork } from "./kconfig";
import { collectionGetNFTsFactory, NFTsFactory } from "./kcollection-get";

const collectionCloneResponse = async (
  chainId: number,
  _name: string,
  _cloner: Signer
): Promise<TransactionResponse | undefined> => {
  // console.log("collectionCloneResponse", chainId, await _cloner.getAddress());

  const network = getNetwork(chainId);

  const nftsFactory: NFTsFactory = collectionGetNFTsFactory(chainId, _cloner);
  let txResp: TransactionResponse | undefined;

  if (nftsFactory) {
    const n: string = (await nftsFactory.implementationsCount()).toString();
    const name = _name || `Open NFTs #${n}`;

    txResp = await nftsFactory.connect(_cloner).clone(name, `NFT${n}`);
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp.hash}`);
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

const collectionClone = async (chainId: number, _name: string, _cloner: Signer): Promise<string> => {
  const txResp = await collectionCloneResponse(chainId, _name, _cloner);
  let address = "";
  if (txResp) {
    const txReceipt = await collectionCloneReceipt(txResp);
    address = collectionCloneAddress(txReceipt);
  }
  return address;
};

export { collectionClone, collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress };
