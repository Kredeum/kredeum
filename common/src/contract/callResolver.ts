import call from "@kredeum/providers/src/call";
import networks from "./networks";

const callResolver = (() => {
  const getBlockNumber = async (chainId: number): Promise<bigint> => await call.getBlockNumber(chainId);

  return {
    getBlockNumber
  };
})();

export default callResolver;
