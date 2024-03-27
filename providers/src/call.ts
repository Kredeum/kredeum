import { type Chain, type Address, type Block, type PublicClient, type Transport, createPublicClient } from "viem";

import chains from "./chains";

//////////////////////////////////////////////////////////////////////////////////////////////////////
// READ : onchain view functions reading the chain via rpc, i.e. functions with publicClient as parameter
//////////////////////////////////////////////////////////////////////////////////////////////////////

const call = (() => {
  const _publicClients: Map<number, PublicClient<Transport, Chain | undefined>> = new Map();

  const _publicClient = (chainId: number) => {
    const chainWithTransport = chains.getWithTransport(chainId);
    const publicClient = createPublicClient(chainWithTransport) as PublicClient<Transport, Chain | undefined>;

    _publicClients.set(chainId, publicClient);

    return publicClient;
  };

  const getPublicClient = (chainId: number) => _publicClients.get(chainId) || _publicClient(chainId);

  const getBlockNumber = async (chainId: number): Promise<bigint> => {
    const publicClient = getPublicClient(chainId);

    return await publicClient.getBlockNumber();
  };

  const getBlock = async (chainId: number, blockNumber?: bigint): Promise<Block> => {
    const publicClient = getPublicClient(chainId);

    const param = blockNumber ? { blockNumber } : {};

    return await publicClient.getBlock(param);
  };

  const getEnsName = async (account: Address) => getPublicClient(1).getEnsName({ address: account });

  const isContract = async (chainId: number, address: Address | undefined): Promise<boolean> => {
    if (!(address && address !== "0x0" && chainId > 0)) return false;

    const publicClient = getPublicClient(chainId);

    const bytecode = await publicClient.getBytecode({ address });

    const _isContract = (bytecode?.length || 0) > 0;

    // console.info('isContract', isContract, chainId, address);
    return _isContract;
  };

  const getChainId = async (chain: Chain) => {
    const publicClient = getPublicClient(chain.id);

    return await publicClient.getChainId();
  };

  return { getPublicClient, getChainId, getEnsName, getBlock, getBlockNumber, isContract };
})();

export default call;
