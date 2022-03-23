import type { Nft, Collection } from "./ktypes";
import { getChainName } from "./kconfig";

const cacheClear = (chainId: number, collection = ""): void => {
  if (typeof localStorage !== "undefined") {
    const chainName = getChainName(chainId);

    if (chainName && collection) {
      const indexMax = localStorage.length;
      const keys: Array<string> = [];

      for (let index = 0; index < indexMax; index++) {
        const key = localStorage.key(index);
        const sig = `${chainName}/${collection}`;

        // Clear NFTs from the specified collection
        // and list of collections ?
        // if (key?.includes(sig) || key?.includes("nfts://")) {
        if (key?.includes(sig)) {
          keys.push(key);
        }
      }
      keys.forEach((_key) => localStorage.removeItem(_key));
    } else {
      localStorage.clear();
    }
  }
};

const cacheNftsListAll = (): Map<string, Nft> => {
  const nfts: Map<string, Nft> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nft://")) {
      const json = localStorage.getItem(key);

      if (json) {
        nfts.set(key, JSON.parse(json) as Nft);
      }
    }
  }
  return nfts;
};

const cacheNftsList = (chainId?: number, collection?: string, account?: string): Map<string, Nft> => {
  const allNFTs = cacheNftsListAll();
  // console.log("allNFTs", allNFTs);

  const NFTs = new Map(
    [...allNFTs].filter(
      ([, nft]) =>
        (!chainId || chainId === nft.chainId) &&
        (!collection || collection === nft.collection) &&
        (!account || account === nft.owner)
    )
  );

  // console.log("_nftsListFromCache =>", NFTs?.size, NFTs);
  return NFTs;
};

const cacheNftGet = (chainId: number, collection: string, tokenID: string): Nft => {
  let nft: Nft = { chainId, collection, tokenID };
  if (!(chainId && collection && tokenID)) return nft;

  const chainName = getChainName(chainId);
  if (!chainName) return nft;

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(`nft://${chainName}/${collection}/${tokenID}`)) {
      nft = JSON.parse(localStorage.getItem(key) || "") as Nft;
      break;
    }
  }
  return nft;
};

const cacheCollectionsListAll = (): Map<string, Collection> => {
  const collections: Map<string, Collection> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nfts://")) {
      collections.set(key, JSON.parse(localStorage.getItem(key) || "") as Collection);
    }
  }

  return collections;
};

const cacheCollectionGet = (chainId: number, collection: string): Collection => {
  let coll: Collection = { chainId, address: collection };
  const chainName = getChainName(chainId);

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(`nfts://${chainName}/${collection}`)) {
      coll = JSON.parse(localStorage.getItem(key) || "") as Collection;
      break;
    }
  }
  return coll;
};

const cacheCollectionsList = (chainId?: number, account?: string): Map<string, Collection> => {
  const allCollections = cacheCollectionsListAll();
  // console.log("allCollections", allCollections);

  const Collections = new Map(
    [...allCollections].filter(
      ([, coll]) =>
        (!chainId || chainId === coll.chainId) && ((account && account === coll.owner) || Number(coll.balanceOf) > 0)
    )
  );

  // console.log("_nftsListFromCache =>", Collections?.size, Collections);
  console.log("cacheClear ~ Collections", Collections);
  return Collections;
};

export {
  cacheClear,
  cacheNftGet,
  cacheNftsList,
  cacheNftsListAll,
  cacheCollectionGet,
  cacheCollectionsList,
  cacheCollectionsListAll
};
