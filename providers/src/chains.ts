import { http } from "viem";
import { arbitrum, bsc, gnosis, mainnet, optimism, polygon, sepolia } from "viem/chains";
import { anvil } from "./anvil";

const chains = [mainnet, gnosis, polygon, bsc, arbitrum, optimism];
const chainsId = chains.map((chain) => chain.id);
type ChainIdsType = (typeof chainsId)[number];

type ChainType = (typeof chains)[number];

type ChainMapType = Map<number, ChainType>;

const chainsMap: ChainMapType = new Map();
for (const chain of chains) chainsMap.set(chain.id, chain);

const chainGet = (chainId: number): ChainType => {
  if (!chainId) throw new Error("chainGet: chainId not defined");
  const chain = chainsMap.get(chainId);
  if (!chain) throw new Error(`chainGet: Chain #${chainId} not found`);

  return chain;
};

const chainGetExplorer = (id: number): string | undefined => {
  const chain = chainGet(id);
  return chain.blockExplorers.default.url;
};

const chainGetWithTransport = (chainId: number) => {
  const chain = chainGet(chainId);

  const INFURA_API_KEY = "7e5ff61abb704742b7783199fbf36327";

  let rpcUrl: string | undefined;

  if (chainId === anvil.id) {
    rpcUrl = "http://127.0.0.1:8545";
  } else if (chainId === gnosis.id) {
    rpcUrl = "https://rpc.ankr.com/gnosis";
    // rpcUrl = "https://gnosis.publicnode.com";
    // rpcUrl = 'https://rpc.gnosis.gateway.fm';
  } else if (chainId === sepolia.id) {
    rpcUrl = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
  } else if (chainId === mainnet.id) {
    rpcUrl = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
    // rpcUrl = `https://rpc.ankr.com/eth`;
  } else if (chainId === polygon.id) {
    rpcUrl = `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`;
  } else if (chainId === arbitrum.id) {
    rpcUrl = `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`;
  } else if (chainId === optimism.id) {
    rpcUrl = `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`;
  } else if (chainId === bsc.id) {
    // rpcUrl = 'https://rpc.ankr.com/bsc';
    rpcUrl = "https://bsc.publicnode.com";
  } else {
    throw new Error(`chainGetWithTransport: RPC url #${chainId} not found`);
  }

  // console.info('chainGetWithTransport ~ rpcUrl:', chainId, rpcUrl);
  const transport = http(rpcUrl);

  return { chain, transport };
};

export { chains, chainsId, chainsMap, chainGet, chainGetWithTransport, chainGetExplorer };
export type { ChainMapType, ChainIdsType };
