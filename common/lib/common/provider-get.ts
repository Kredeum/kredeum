/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Provider } from "@ethersproject/abstract-provider";
import type { FallbackProviderConfig, Web3Provider } from "@ethersproject/providers";
import type { Signer } from "ethers";

import type { WindowExternalProvider } from "./types";
import { getNetwork, sleep } from "@lib/common/config";
import { ethers } from "ethers";

// Cache providers per chainId
const _providersPerChainId: Map<number, Provider> = new Map();

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

const providerSetFallback = async (chainId: number): Promise<boolean> => {
  console.log("providerSetFallback START", chainId);
  if (!chainId) return false;

  let provider: Provider | undefined = _providersPerChainId.get(chainId);
  if (!provider) {
    const providers: Array<FallbackProviderConfig> = [];
    const providerWindow = await providerGetWindow(chainId);
    const network = getNetwork(chainId);

    if (providerWindow) providers.push({ provider: providerWindow, priority: 1, weight: 1 });
    if (network?.rpcUrls[0])
      providers.push({ provider: new ethers.providers.JsonRpcProvider(network?.rpcUrls[0]), priority: 2, weight: 1 });
    if (network?.rpcUrls[1])
      providers.push({ provider: new ethers.providers.JsonRpcProvider(network?.rpcUrls[1]), priority: 3, weight: 1 });

    if (providers.length == 0) throw Error(`No provider found for this network! #${chainId}`);
    console.log(`providerSetFallback #${chainId} #${providers.length}`);

    provider = new ethers.providers.FallbackProvider(providers, 1);
    _providersPerChainId.set(chainId, provider);
  }

  const ok = Boolean(provider);
  console.log("providerSetFallback END", ok);

  return ok;
};

const providerGetFallback = async (chainId: number): Promise<Provider> => {
  // console.log("providerGetFallback START");
  let provider: Provider | undefined;
  let i = 0;
  // 500 * 20 = 10s
  while (i++ < 500) {
    provider = _providersPerChainId.get(chainId);
    if (provider) break;

    await sleep(20);
    console.log("providerGetFallback sleep", i);
  }

  // console.log("providerGetFallback OK !", (await provider?.getBlockNumber()) || 0);
  return provider as Provider;
};

const providerGetSignerOrProvider = async (chainId = 0, getSigner = false): Promise<Signer | Provider | undefined> => {
  return await (getSigner ? providerGetSigner(chainId) : providerGetFallback(chainId));
};

export {
  providerSetFallback,
  providerGetFallback,
  providerGetWindow,
  providerGetSigner,
  providerGetAccount,
  providerGetSignerOrProvider
};
