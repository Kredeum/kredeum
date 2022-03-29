import type { Collection, Nft } from "lib/ktypes";
import { urlOwner, nftsUrl, nftUrl3, getChainName } from "lib/kconfig";

const storeSet = (key: string, value: string): void => {
  typeof localStorage !== "undefined" && localStorage.setItem(key, value);
};

const storeNftSet = (nft: Nft) => {
  const nid = nftUrl3(nft.chainId, nft.collection, nft.tokenID) || "";
  storeSet(nid, JSON.stringify(nft, null, 2));
};

const storeCollectionSet = (account: string, collectionObject: Collection): void => {
  storeSet(
    urlOwner(nftsUrl(collectionObject.chainId, collectionObject.address), account),
    JSON.stringify(collectionObject, null, 2)
  );
};

const storeCollectionSetDefaultAddress = (chainId: number, account: string, collection: string): void =>
  storeSet(`defaultCollection/${chainId}/${account}`, collection);

const storeCollectionSetDefaultMintableAddress = (chainId: number, collection: string): void =>
  storeSet(`defaultMintableCollection/${chainId}`, collection);

const storeGet = (key: string): string => {
  return typeof localStorage !== "undefined" ? localStorage.getItem(key) || "" : "";
};

const storeNftGet = (chainId: number, collection: string, tokenID: string): Nft => {
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

const storeNftsListAll = (): Map<string, Nft> => {
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

const storeNftsList = (chainId?: number, collection?: string, account?: string): Map<string, Nft> => {
  const allNFTs = storeNftsListAll();
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

const storeCollectionGet = (chainId: number, collection: string): Collection => {
  let coll: Collection = { chainId, address: collection };
  const chainName = getChainName(chainId);

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(`nfts://${chainName}/${collection}`)) {
      coll = JSON.parse(localStorage.getItem(key) || "") as Collection;
      break;
    }
  }
  // console.log("storeCollectionGet", chainId, collection, "=>", coll);
  return coll;
};

const storeCollectionListAll = (): Map<string, Collection> => {
  const collections: Map<string, Collection> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nfts://")) {
      collections.set(key, JSON.parse(localStorage.getItem(key) || "") as Collection);
    }
  }

  return collections;
};

const storeCollectionList = (chainId?: number, account?: string): Map<string, Collection> => {
  const allCollections = storeCollectionListAll();
  // console.log("allCollections", allCollections);

  const Collections = new Map(
    [...allCollections].filter(
      ([, coll]) =>
        (!chainId || chainId === coll.chainId) && ((account && account === coll.owner) || Number(coll.balanceOf) > 0)
    )
  );

  // console.log("_nftsListFromCache =>", Collections?.size, Collections);
  console.log("storeClear ~ Collections", Collections);
  return Collections;
};

const storeCollectionGetDefaultAddress = (chainId: number, account: string): string =>
  storeGet(`defaultCollection/${chainId}/${account}`) || "";

const storeCollectionGetDefaultMintableAddress = (chainId: number): string =>
  storeGet(`defaultMintableCollection/${chainId}`) || "";

const storeClear = (chainId: number, collection = ""): void => {
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

const storeClearAll = (): void => localStorage.clear();

export {
  storeSet,
  storeNftSet,
  storeCollectionSet,
  storeCollectionSetDefaultAddress,
  storeCollectionSetDefaultMintableAddress,
  storeGet,
  storeNftGet,
  storeCollectionGet,
  storeCollectionGetDefaultAddress,
  storeCollectionGetDefaultMintableAddress,
  storeNftsList,
  storeNftsListAll,
  storeCollectionList,
  storeCollectionListAll,
  storeClear,
  storeClearAll
};
