/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Provider } from "@ethersproject/abstract-provider";
import type { FallbackProviderConfig, Web3Provider } from "@ethersproject/providers";
import type { Signer } from "ethers";

import type { WindowExternalProvider } from "./types";
import { getChecksumAddress, sleep } from "@kredeum/common/lib/common/config";
import { ethers } from "ethers";
import { constants } from "ethers";
import { networks } from "./networks";

let _providerSetting = false;

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
  let account = constants.AddressZero;

  if (provider) {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) account = getChecksumAddress(accounts[0]);
  }

  return account;
};

const providerSetFallback = async (chainId: number): Promise<void> => {
  _providerSetting = true;

  // console.log("providerSetFallback START", chainId);

  let provider: Provider | undefined = _providersPerChainId.get(chainId);
  if (!provider) {
    const providers: Array<FallbackProviderConfig> = [];
    const providerWindow = await providerGetWindow(chainId);
    const network = networks.get(chainId);

    if (providerWindow) providers.push({ provider: providerWindow, priority: 1, weight: 1 });
    if (network?.rpcUrls[0])
      providers.push({ provider: new ethers.providers.JsonRpcProvider(network?.rpcUrls[0]), priority: 2, weight: 1 });
    if (network?.rpcUrls[1])
      providers.push({ provider: new ethers.providers.JsonRpcProvider(network?.rpcUrls[1]), priority: 3, weight: 1 });

    // console.info(`providerSetFallback #${chainId} #${providers.length}`);

    provider = new ethers.providers.FallbackProvider(providers, 1);
    if (!provider) throw Error(`No provider found for this network! #${chainId}`);

    _providersPerChainId.set(chainId, provider);
  }

  _providerSetting = false;
};

const providerGetFallback = async (chainId: number): Promise<Provider> => {
  // console.log("providerGetFallback START", chainId);
  let provider: Provider | undefined;

  let i = 0;
  const ms = 20;
  const max = 500;
  // 500 * 20 = 10s
  while (i++ < max) {
    provider = _providersPerChainId.get(chainId);
    if (provider) break;

    if (_providerSetting) {
      await sleep(ms);
      i > 10 && console.info("providerGetFallback SLEEP", i);
    } else {
      await providerSetFallback(chainId);
    }
  }

  // console.log("providerGetFallback END", chainId, (provider ? "OK" : "KO"));
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
