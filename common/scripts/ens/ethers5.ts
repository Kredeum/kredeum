import { providers } from "ethers";

const main = async () => {
  const rpcUrl = "https://rpc.ankr.com/eth";
  const provider = new providers.JsonRpcProvider(rpcUrl);

  const ensName = await provider.resolveName("zapaz.eth");
  console.log("ensName:", ensName);

  const ensAvatar = await provider.getAvatar("zapaz.eth");
  console.log("ensAvatar:", ensAvatar);
};

main().catch(console.error);
