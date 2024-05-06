import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const address = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";

const main = async () => {
  const ensName = await publicClient.getEnsName({ address });
  console.log("ensName  :", ensName);

  if (!ensName) return;

  const ensAvatar = await publicClient.getEnsAvatar({
    name: normalize(ensName)
  });
  console.log("ensAvatar:", ensAvatar);
};

main().catch(console.error);
