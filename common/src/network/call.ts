import { type Chain, type Address, type Block, type PublicClient, type Transport, createPublicClient } from "viem";

import chains from "providers/src/chains";

//////////////////////////////////////////////////////////////////////////////////////////////////////
// READ : onchain view functions reading the chain via rpc, i.e. functions with publicClient as parameter
//////////////////////////////////////////////////////////////////////////////////////////////////////

// publicClients Map used as cache
const _publicClients: Map<number, PublicClient<Transport, Chain | undefined>> = new Map();

const _publicClient = (chainId: number) => {
  const chainWithTransport = chains.getWithTransport(chainId);
  const publicClient = createPublicClient(chainWithTransport) as PublicClient<Transport, Chain | undefined>;

  _publicClients.set(chainId, publicClient);

  return publicClient;
};

const callPublicClient = (chainId: number) => _publicClients.get(chainId) || _publicClient(chainId);

const callBlockNumber = async (chainId: number): Promise<bigint> => {
  const publicClient = callPublicClient(chainId);

  return await publicClient.getBlockNumber();
};

const callBlock = async (chainId: number, blockNumber?: bigint): Promise<Block> => {
  const publicClient = callPublicClient(chainId);

  const param = blockNumber ? { blockNumber } : {};

  return await publicClient.getBlock(param);
};

const callEnsName = async (account: Address) => callPublicClient(1).getEnsName({ address: account });

const callIsContract = async (chainId: number, address: Address | undefined): Promise<boolean> => {
  if (!(address && address !== "0x0" && chainId > 0)) return false;

  const publicClient = callPublicClient(chainId);

  const bytecode = await publicClient.getBytecode({ address });

  const isContract = (bytecode?.length || 0) > 0;

  // console.info('callIsContract', isContract, chainId, address);
  return isContract;
};

const callChainId = async (chain: Chain) => {
  const publicClient = callPublicClient(chain.id);

  return await publicClient.getChainId();
};

export { callPublicClient, callChainId, callEnsName, callIsContract, callBlock, callBlockNumber };
