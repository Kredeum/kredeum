import { providers } from "ethers";
import { getNetwork } from "@lib/common/config";
import { EnsResolver, JsonRpcProvider } from "@ethersproject/providers";

const rpcUrl: string = getNetwork(1)?.rpcUrls[0] || "";

const ensProvider: JsonRpcProvider = new providers.JsonRpcProvider(rpcUrl);

const ensResolver = async (address: string): Promise<EnsResolver | null> => await ensProvider.getResolver(address);

const ensGetName = async (address: string): Promise<string> => {
  let name = "";
  try {
    name = (await ensProvider.lookupAddress(address)) || "";
  } catch (e) {
    console.error("ENS lookupAddress not found");
  }
  return name || address || "";
};

const ensGetAvatar = async (address: string): Promise<string> => {
  let avatar = "";
  try {
    avatar = (await ensProvider.getAvatar(address)) || "";
  } catch (e) {
    console.error("ENS lookupAddress not found");
  }
  return avatar || "";
};

export { ensProvider, ensResolver, ensGetName, ensGetAvatar };
