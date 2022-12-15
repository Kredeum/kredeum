/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Provider } from "@ethersproject/abstract-provider";
import type { Web3Provider } from "@ethersproject/providers";
import type { Signer } from "ethers";

import type { WindowExternalProvider } from "./types";
import { getNetwork } from "@lib/common/config";
import { ethers } from "ethers";

// Cache providers (chainId)
const _providersCache: Map<string, Array<Provider>> = new Map();

const providerGetWindow = async (chainId = 0): Promise<Web3Provider | undefined> => {
  const externalProvider = (window as WindowExternalProvider).ethereum || undefined;
  if (!externalProvider) return undefined;

  const provider = new ethers.providers.Web3Provider(externalProvider, "any");
  if (!provider) return undefined;

  if (chainId) {
    const providerChainId = (await provider.getNetwork()).chainId;
    if (providerChainId != chainId) return undefined;
  }

  return provider;
};

const providerGetSigner = async (chainId = 0, accountOrIndex: string | number = 0): Promise<Signer | undefined> => {
  const provider = await providerGetWindow(chainId);

  return provider && provider.getSigner(accountOrIndex);
};

const providerGetAccount = async (): Promise<string> => {
  const provider = await providerGetWindow();
  let account = "";

  if (provider) {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) account = accounts[0];
  }

  return account;
};

const providerGetFallback = async (chainId: number): Promise<Provider> => {
  const providers: Array<Provider> = _providersCache.get(String(chainId)) || [];
  if (providers.length == 0) {
    const providerWindow = await providerGetWindow(chainId);
    const network = getNetwork(chainId);

    if (providerWindow) providers.push(providerWindow);
    if (network?.rpcUrls[0]) providers.push(new ethers.providers.JsonRpcProvider(network?.rpcUrls[0]));
    if (network?.rpcUrls[1]) providers.push(new ethers.providers.JsonRpcProvider(network?.rpcUrls[1]));

    if (providers.length == 0) throw Error(`No provider found for this network! #${chainId}`);

    _providersCache.set(String(chainId), providers);
  }

  // console.log("providerGetFallback", providers);
  console.log(`providerGetFallback #${chainId} #${providers.length}`);
  return new ethers.providers.FallbackProvider(providers);
};

const providerGetSignerOrProvider = async (chainId = 0, getSigner = false): Promise<Signer | Provider | undefined> => {
  return await (getSigner ? providerGetSigner(chainId) : providerGetFallback(chainId));
};

export { providerGetFallback, providerGetWindow, providerGetSigner, providerGetAccount, providerGetSignerOrProvider };
