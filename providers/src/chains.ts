import { http, type Chain } from "viem";

const chains = (() => {
  let _chains: Chain[] = [];

  const set = (chains_: Chain[]) => {
    _chains = chains_;
  };

  const get = (chainId: number): Chain => {
    const _chain = _chains.find((ch) => ch.id === chainId);
    if (!_chain) throw new Error(`Chain #${chainId} not found`);
    return _chain;
  };

  const getWithTransport = (chainId: number, rpcUrl?: string) => {
    const chain = get(chainId);
    const transport = http(rpcUrl);

    return { chain, transport };
  };

  const getIds = _chains.map((ch) => ch.id);

  const getId = (chainName: string): number => {
    const _chain = _chains.find((ch: Chain) => ch.name === chainName);
    if (!_chain) throw new Error(`Chain '${chainName}' not found`);
    return _chain.id;
  };

  const getName = (id: number): string => get(id).name;

  const getNativeCurrency = (id: number): string => get(id).nativeCurrency.symbol;

  const getRpcUrl = (id: number): string => get(id).rpcUrls.default.http[0];

  const getExplorer = (id: number): string => {
    const _blockExplorers = get(id).blockExplorers;
    if (!_blockExplorers)
      throw new Error(`Chain #${id} has no block explorers
`);
    return _blockExplorers.default.url || "";
  };

  return { set, get, getWithTransport, getIds, getId, getExplorer, getName, getNativeCurrency, getRpcUrl };
})();

export default chains;
