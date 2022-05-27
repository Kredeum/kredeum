import type { JsonRpcSigner } from "@ethersproject/providers";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import type { OpenMulti } from "types/OpenMulti";

import { getNetwork, nftKey } from "./kconfig";
import IOpenMulti from "abis/IOpenMulti.json";
import { Contract, BigNumber } from "ethers";

const nftClaimResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  console.log(`nftClaimResponse ${nftKey(chainId, address, tokenID)}`);

  let txResp: TransactionResponse | undefined;
  const network = getNetwork(chainId);

  if (network?.openMulti && chainId && address && tokenID && owner) {
    const openMulti = new Contract(network.openMulti, IOpenMulti, owner) as OpenMulti;

    txResp = await openMulti.claim(await owner.getAddress(), BigNumber.from(tokenID));
    console.log(`${network?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);
  }

  return txResp;
};

const nftClaimReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const nftClaim = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner
): Promise<TransactionReceipt | undefined> => {
  // console.log("nftClaim", chainId, address, tokenID, destinationAddress);

  const txResp = await nftClaimResponse(chainId, address, tokenID, owner);
  const txReceipt = txResp && (await nftClaimReceipt(txResp));

  return txReceipt;
};

export { nftClaim, nftClaimResponse, nftClaimReceipt };
