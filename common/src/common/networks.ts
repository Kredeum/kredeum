import type { NetworkType, NftType } from "../common/types";
import mainnetsJson from "@kredeum/config/dist/mainnets.json";
import testnetsJson from "@kredeum/config/dist/testnets.json";

type chainIdish = number | string | undefined;

// Capitalize first letter
const strUpFirst = (str: string | undefined): string =>
  str && str.length >= 1 ? str.charAt(0).toUpperCase() + str.substring(1) : "";

// Sanitize string
const strSanitize = (str: string | undefined): string => str?.replace(/_|-/g, " ") || "";

const networks = (() => {
  const _networksMap = new Map(
    [...mainnetsJson, ...testnetsJson].map((network: NetworkType) => [network.chainId, network])
  );

  // const _getMap = (): Map<number, NetworkType> | undefined => _networksMap;
  const _getAll = (): NetworkType[] => [...(_networksMap?.values() || [])];
  const _getAllActive = (): NetworkType[] => _getAll().filter((nw: NetworkType) => !(nw.active === false));
  const getAllSameType = (chainId: chainIdish): NetworkType[] =>
    _getAllActive().filter((nw: NetworkType) => isMainnet(nw.chainId) === isMainnet(chainId));

  const get = (chainId: chainIdish): NetworkType | undefined => _networksMap?.get(Number(chainId));

  const getChainId = (chainName: string): number | undefined =>
    _getAll()?.find((nw: NetworkType) => nw.chainName === chainName)?.chainId;
  const getExplorer = (chainId: chainIdish): string => get(chainId)?.blockExplorerUrls[0] || "";
  const getOpenSea = (chainId: chainIdish): string => get(chainId)?.openSea || "";
  const getBlur = (chainId: chainIdish): string => get(chainId)?.blur || "";
  const getCreate = (chainId: chainIdish): boolean => Boolean(get(chainId)?.create);
  const getLinkedMainnet = (chainId: chainIdish): number => get(chainId)?.linkedMainnet || 0;
  const getLinkedLayer1 = (chainId: chainIdish): number => get(chainId)?.linkedLayer1 || 0;
  const getCurrency = (chainId: chainIdish): string => get(chainId)?.nativeCurrency.symbol || "";
  const getOpenSeaUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
    `${getOpenSea(chainId)}/${ref?.address}/${ref?.tokenID}`;
  const getBlurUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
    `${getBlur(chainId)}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;

  const getRpcUrl = (chainId: chainIdish): string => get(chainId)?.rpcUrls[0] || "";

  const has = (chainId: chainIdish): boolean => _networksMap?.has(Number(chainId));

  const isActive = (chainId: chainIdish): boolean => get(chainId)?.active || false;
  const isEip1559 = (chainId: chainIdish): boolean => Boolean(get(chainId)?.eip1559);
  const isMainnet = (chainId: chainIdish): boolean => getLinkedMainnet(chainId) == 0;
  const isTestnet = (chainId: chainIdish): boolean => !isMainnet(chainId);
  const isLayer1 = (chainId: chainIdish): boolean => getLinkedLayer1(chainId) == 0;
  const isLayer2 = (chainId: chainIdish): boolean => !isLayer1(chainId);

  const getChainName = (chainId: chainIdish): string | undefined => get(chainId)?.chainName;
  const getChainLabel = (chainId: chainIdish): string | undefined =>
    get(chainId)?.chainLabel || strUpFirst(strSanitize(getChainName(chainId)));
  const getMainnetName = (chainId: chainIdish) =>
    isTestnet(chainId) ? getChainName(getLinkedMainnet(chainId)) : getChainName(chainId);

  // console.log("networks.getAll", getAll());
  // console.log("networks.getAllSameType mainnet", getAllSameType(1));
  // console.log("networks.getAllSameType sepolia", getAllSameType(11155111));

  return {
    has,
    get,

    getAllSameType,

    getBlur,
    getBlurUrl,
    getRpcUrl,
    getCurrency,
    getOpenSeaUrl,
    getCreate,
    getChainId,
    getOpenSea,
    getExplorer,
    getChainName,
    getChainLabel,
    getMainnetName,
    getLinkedMainnet,
    getLinkedLayer1,
    isLayer1,
    isLayer2,
    isActive,
    isTestnet,
    isEip1559,
    isMainnet
  };
})();

export { networks };
