import { buildNetworks } from "@utils/buildNetworks";

const main = async (): Promise<void> => {
  await buildNetworks();
};

main().catch(console.error);
