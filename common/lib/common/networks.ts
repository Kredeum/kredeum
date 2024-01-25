import type { NetworkType, NftType } from "@lib/common/types";
import mainnetsJson from "@kredeum/config/dist/mainnets.json";
import testnetsJson from "@kredeum/config/dist/testnets.json";

const networks = (() => {
  const _networksMap = new Map(
    [...mainnetsJson, ...testnetsJson].map((network: NetworkType) => [network.chainId, network])
  );

  // const _getMap = (): Map<number, NetworkType> | undefined => _networksMap;
  const _getAll = (): NetworkType[] => [...(_networksMap?.values() || [])];
  const _getAllActive = (): NetworkType[] => _getAll().filter((nw: NetworkType) => !(nw.active === false));
  const getAllSameType = (chainId: number): NetworkType[] =>
    _getAllActive().filter((nw: NetworkType) => isMainnet(nw.chainId) === isMainnet(chainId));

  const get = (chainId: number | string | undefined): NetworkType | undefined => _networksMap?.get(Number(chainId));
  const getChainName = (chainId: number | string | undefined): string | undefined => get(chainId)?.chainName;
  const getChainId = (chainName: string): number | undefined =>
    _getAll()?.find((nw: NetworkType) => nw.chainName === chainName)?.chainId;
  const getExplorer = (chainId: number): string => get(chainId)?.blockExplorerUrls[0] || "";
  const getOpenSea = (chainId: number): string => get(chainId)?.openSea || "";
  const getBlur = (chainId: number): string => get(chainId)?.blur || "";
  const getCreate = (chainId: number): boolean => Boolean(get(chainId)?.create);
  const getLinkedMainnet = (chainId: number | string): number => get(chainId)?.linkedMainnet || 0;
  const getLinkedLayer1 = (chainId: number | string): number => get(chainId)?.linkedLayer1 || 0;
  const getCurrency = (chainId: number): string => get(chainId)?.nativeCurrency.symbol || "";
  const getOpenSeaUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
    `${getOpenSea(chainId)}/${ref?.address}/${ref?.tokenID}`;
  const getBlurUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
    `${getBlur(chainId)}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;

  const getRpcUrl = (chainId: number | string): string => get(chainId)?.rpcUrls[0] || "";

  const has = (chainId: number | string | undefined): boolean => _networksMap?.has(Number(chainId));

  const isActive = (chainId: number | string): boolean => get(chainId)?.active || false;
  const isEip1559 = (chainId: number | string): boolean => Boolean(get(chainId)?.eip1559);
  const isMainnet = (chainId: number | string): boolean => getLinkedMainnet(chainId) == 0;
  const isTestnet = (chainId: number | string): boolean => !isMainnet(chainId);
  const isLayer1 = (chainId: number | string): boolean => getLinkedLayer1(chainId) == 0;
  const isLayer2 = (chainId: number | string): boolean => !isLayer1(chainId);

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
