import type { Provider } from "@ethersproject/abstract-provider";
import { providers } from "ethers";
import { getNetwork } from "@lib/common/config";

const ensGetName = async (address: string): Promise<string> => {
  let name = "";
  const rpc: string = getNetwork(1)?.rpcUrls[0] || "";
  try {
    const ensProvider: Provider = new providers.JsonRpcProvider(rpc);
    name = (await ensProvider.lookupAddress(address)) || "";
  } catch (e) {
    console.error("NO ENS found");
  }
  return name || address || "";
};

export { ensGetName };
