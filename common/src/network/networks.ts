import { type Address, type Chain } from "viem";
import mainnetsJson from "config/dist/mainnets.json";
import testnetsJson from "config/dist/testnets.json";
import { arbitrum, bsc, gnosis, mainnet, optimism, polygon, sepolia } from "viem/chains";
import chains from "providers/src/chains";
import { anvil } from "providers/src/anvil";

import { type NetworkType, NftType } from "../common/types";
import { strUpFirst } from "../common/config";

const _chains: Chain[] = [mainnet, gnosis, polygon, bsc, arbitrum, optimism, anvil, sepolia];
const _chainsId: number[] = _chains.map((ch) => ch.id);
type ChainIdType = (typeof _chainsId)[number];

const _strSanitize = (str: string | undefined): string => str?.replace(/_|-/g, " ") || "";

const networks = (() => {
  chains.set(_chains);

  const _networksMap = new Map(
    [...mainnetsJson, ...testnetsJson].map((network: NetworkType) => [network.chainId, network])
  );
  for (const [id, nw] of [..._networksMap]) {
    if (nw.active && !_chainsId.includes(id)) throw new Error(`Active Network #${id} not found in Chains`);
  }

  const _getAll = (): NetworkType[] => [..._networksMap.values()];
  const _getAllActive = (): NetworkType[] => _getAll().filter((nw: NetworkType) => !(nw.active === false));
  const getAllSameType = (chainId: ChainIdType): NetworkType[] => {
    const _isMainnet = isMainnet(chainId);
    return _getAllActive().filter((nw: NetworkType) => isMainnet(nw.chainId) === _isMainnet);
  };

  const get = (chainId: ChainIdType): NetworkType => {
    if (!_chainsId.includes(chainId)) throw new Error(`Chain #${chainId} not found`);

    const _network = _networksMap.get(chainId);
    if (!_network) throw new Error(`Network #${chainId} not found`);

    return _network;
  };

  const getOpenSea = (chainId: ChainIdType): string => get(chainId)?.openSea || "";
  const getBlur = (chainId: ChainIdType): string => get(chainId)?.blur || "";
  const getCreate = (chainId: ChainIdType): boolean => Boolean(get(chainId).create);
  const getLinkedMainnet = (chainId: ChainIdType): ChainIdType | 0 => (get(chainId).linkedMainnet as ChainIdType) || 0;
  const getLinkedLayer1 = (chainId: ChainIdType): ChainIdType | 0 => (get(chainId).linkedLayer1 as ChainIdType) || 0;
  const getOpenSeaUrl = (chainId: ChainIdType, ref: NftType | { address: Address; tokenID: string }): string =>
    `${getOpenSea(chainId)}/${ref?.address}/${ref?.tokenID}`;
  const getBlurUrl = (chainId: ChainIdType, ref: NftType | { address: Address; tokenID: string }): string =>
    `${getBlur(chainId)}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;

  const has = (chainId: ChainIdType): boolean => _networksMap?.has(chainId);

  const isActive = (chainId: ChainIdType): boolean => get(chainId)?.active || false;
  const isEip1559 = (chainId: ChainIdType): boolean => Boolean(get(chainId)?.eip1559);
  const isMainnet = (chainId: ChainIdType): boolean => getLinkedMainnet(chainId) == 0;
  const isTestnet = (chainId: ChainIdType): boolean => !isMainnet(chainId);
  const isLayer1 = (chainId: ChainIdType): boolean => getLinkedLayer1(chainId) === undefined;
  const isLayer2 = (chainId: ChainIdType): boolean => !isLayer1(chainId);

  const getLabel = (chainId: ChainIdType): string =>
    get(chainId).chainLabel || strUpFirst(_strSanitize(chains.getName(chainId)));

  const getMainnetName = (chainId: ChainIdType): string => {
    if (isMainnet(chainId)) return chains.getName(chainId);

    const mainnetId = getLinkedMainnet(chainId);
    if (mainnetId === 0) throw new Error(`Mainnet not found for chainId #${chainId}`);

    return chains.getName(mainnetId);
  };

  const getRpcUrl = (chainId: ChainIdType): string => get(chainId).rpcUrls[0] || chains.getRpcUrl(chainId);
  const getName = (chainId: ChainIdType): string => get(chainId).chainName || chains.getName(chainId);

  const getExplorer = (chainId: ChainIdType): string =>
    get(chainId).blockExplorerUrls[0] || chains.getExplorer(chainId);

  const getNativeCurrency = (chainId: ChainIdType): string =>
    get(chainId).nativeCurrency.name || chains.getNativeCurrency(chainId);

  const getChainId = (chainName: string): ChainIdType => {
    const network = _getAll()?.find((nw: NetworkType) => nw.chainName === chainName);

    if (network) return network.chainId;
    else return chains.getId(chainName);
  };

  // console.log("network.getAll", getAll());

  return {
    getChain: chains.get,

    getName,
    getExplorer,
    getNativeCurrency,
    getChainId,

    has,
    get,
    getBlur,
    getLabel,
    getRpcUrl,
    getCreate,
    getBlurUrl,
    getOpenSea,
    getOpenSeaUrl,
    getAllSameType,
    getMainnetName,
    getLinkedMainnet,
    getLinkedLayer1,

    isLayer1,
    isLayer2,
    isActive,
    isMainnet,
    isTestnet,
    isEip1559
  };
})();

export default networks;
