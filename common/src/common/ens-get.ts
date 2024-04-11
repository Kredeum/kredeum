// import { providers } from "ethers";

// import { JsonRpcProvider } from "@ethersproject/providers";
// import config from "@kredeum/config/dist/config.json";
import { type Address } from "viem";

const ens = (() => {
  // const ensProvider: JsonRpcProvider = new providers.JsonRpcProvider(config.ens.rpcUrl);

  const getName = async (address: Address): Promise<string> => {
    const name = "";

    try {
      // name = (await ensProvider.lookupAddress(address)) || "";
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    return name || address || "";
  };

  const getAvatar = async (address: string | Address): Promise<string> => {
    const avatar = "";

    try {
      // avatar = (await ensProvider.getAvatar(address)) || "";
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    return avatar || "";
  };

  return { getName, getAvatar };
})();

export { ens };
