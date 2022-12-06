import type { Provider } from "@ethersproject/abstract-provider";
import type { ExternalProvider } from "@ethersproject/providers";

import { getNetwork } from "@lib/common/kconfig";
import { ethers } from "ethers";

const providerGetWindow = async (chainId: number): Promise<Provider | null> => {
  const externalProvider = (window as { ethereum?: ExternalProvider })?.ethereum || null;
  if (!externalProvider) return null;

  const provider = new ethers.providers.Web3Provider(externalProvider, "any");
  if (!provider) return null;

  const providerChainId = (await provider.getNetwork()).chainId;
  if (providerChainId != chainId) return null;

  return provider;
};


const providerGetFallback = async (chainId: number): Promise<Provider> => {
  const providerWindow = await providerGetWindow(chainId);
  const network = getNetwork(chainId);

  const providers: Array<Provider> = [];
  if (providerWindow) providers.push(providerWindow);
  if (network?.rpcUrls[0]) providers.push(new ethers.providers.JsonRpcProvider(network?.rpcUrls[0]));
  if (network?.rpcUrls[1]) providers.push(new ethers.providers.JsonRpcProvider(network?.rpcUrls[1]));

  if (providers.length == 0) throw Error(`No provider found for this network! #${chainId}`);

  // console.log("providerGetFallback", providers);
  console.log(`providerGetFallback #${providers.length}`);
  return new ethers.providers.FallbackProvider(providers);
};

export { providerGetFallback, providerGetWindow };