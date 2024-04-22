import call from "@kredeum/providers/src/call";
import networks from "./networks";

const callResolver = (() => {
  const getBlockNumber = async (chainId: number): Promise<bigint> => await call.getBlockNumber(chainId);

  const num = networks.getChainId("mainnet");
  console.log("callResolver ~ num:", num);

  return {
    getBlockNumber
  };
})();

export default callResolver;
