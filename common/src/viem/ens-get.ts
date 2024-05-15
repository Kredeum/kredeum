import { Address, createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const ens = (() => {
  const getName = async (address: string): Promise<string> => {
    let name: string | null = null;

    try {
      name = await publicClient.getEnsName({ address: address as Address });
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    // console.log("getName", address, "=>", name);
    return name || address || "";
  };

  const getAvatar = async (address: string): Promise<string> => {
    let avatar: string | null = null;

    try {
      // avatar = await ensProvider.getAvatar(address);
      avatar = await publicClient.getEnsAvatar({
        name: normalize(address)
      });
    } catch (e) {
      console.error("ENS lookupAddress not found");
    }

    // console.log("getAvatar", address, "=>", avatar);
    return avatar || "";
  };

  return { getName, getAvatar };
})();

export { ens };
