import {
  FallbackProvider,
  JsonRpcProvider,
  Signer,
  Provider,
  ZeroAddress,
  AbstractProvider,
  Eip1193Provider
} from "ethers";
import { BrowserProvider } from "ethers";
import type { FallbackProviderConfig } from "ethers/types/providers/provider-fallback";

import type { WindowEthereumProvider } from "@lib/common/types";
import { getChecksumAddress, getNetworkRpcUrls, sleep } from "@lib/common/config";

let _providerSetting = false;

// Cache providers per chainId
const _providersPerChainId: Map<number, Provider> = new Map();

const providerGetChainId = async (provider: AbstractProvider): Promise<number> => {
  const chainId = Number((await provider.getNetwork()).chainId);
  console.log("providerGetChainId", chainId);
  return chainId;
};

const providerGetWindow = async (): Promise<BrowserProvider | undefined> => {
  // console.log("providerGetWindow");

  const windowEthereumProvider = (window as WindowEthereumProvider).ethereum || undefined;
  if (!windowEthereumProvider) return undefined;

  const provider = new BrowserProvider(windowEthereumProvider as Eip1193Provider, "any");
  if (!provider) return undefined;

  // console.log("providerGetWindow", provider);
  return provider;
};

const providerGetSigner = async (chainId?: number): Promise<Signer | undefined> => {
  // console.log("providerGetSigner");
  const provider: BrowserProvider | undefined = await providerGetWindow();
  const providerChainId = Number((await provider?.getNetwork())?.chainId);

  if (chainId && chainId != providerChainId) {
    throw Error(`signer on wrong networtk ${chainId} != ${providerChainId} `);
  }

  return (await provider?.getSigner(0)) as Signer | undefined;
};

const providerGetAccount = async (): Promise<string> => {
  // console.log("providerGetAccount");
  const signer = await providerGetSigner();
  if (!signer) return ZeroAddress;

  const account = getChecksumAddress(await signer.getAddress());

  // console.log("providerGetAccount ~ account:", account);
  return account;
};

const providerSetFallback = async (chainId: number): Promise<void> => {
  console.log("providerSetFallback", chainId);
  _providerSetting = true;

  // console.log("providerSetFallback START", chainId);

  let provider: Provider | undefined = _providersPerChainId.get(chainId);
  if (!provider) {
    const providers: Array<AbstractProvider | FallbackProviderConfig> = [];

    const providerWindow = await providerGetWindow();
    const providerWindowChainId = providerWindow && (await providerGetChainId(providerWindow));
    if (providerWindow && providerWindowChainId === chainId)
      providers.push({ provider: providerWindow, priority: 1, weight: 1 });

    const rpcUrls = getNetworkRpcUrls(chainId);
    if (rpcUrls[0]) providers.push({ provider: new JsonRpcProvider(rpcUrls[0]), priority: 2, weight: 1 });
    if (rpcUrls[1]) providers.push({ provider: new JsonRpcProvider(rpcUrls[1]), priority: 3, weight: 1 });

    // console.info(`providerSetFallback #${chainId} #${providers.length}`);

    provider = new FallbackProvider(providers, "any");
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

const providerGetSignerOrProvider = async (chainId = 0, getSigner = false): Promise<Signer | Provider | undefined> =>
  getSigner ? await providerGetSigner(chainId) : await providerGetFallback(chainId);

export {
  providerSetFallback,
  providerGetFallback,
  providerGetWindow,
  providerGetSigner,
  providerGetAccount,
  providerGetSignerOrProvider
};
