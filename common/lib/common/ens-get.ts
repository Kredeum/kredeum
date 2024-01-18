import { providers } from "ethers";

import { JsonRpcProvider } from "@ethersproject/providers";
import config from "@config/config.json";

const ens = (() => {
  let ensProvider: JsonRpcProvider;

  const getName = async (address: string): Promise<string> => {
    ensProvider ||= new providers.JsonRpcProvider(config.ens.rpcUrl);
    console.log("getName ~ ensProvider:", ensProvider);
    let name = "";

    try {
      name = (await ensProvider.lookupAddress(address)) || "";
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    return name || address || "";
  };

  const getAvatar = async (address: string): Promise<string> => {
    ensProvider ||= new providers.JsonRpcProvider(config.ens.rpcUrl);
    let avatar = "";

    try {
      avatar = (await ensProvider.getAvatar(address)) || "";
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    return avatar || "";
  };

  return { getName, getAvatar };
})();

export { ens };
