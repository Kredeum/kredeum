<script lang="ts">
  import type { Collection, Nft as NftType } from "lib/ktypes";
  import { nftListTokenIds } from "lib/knft-list";
  import { nftGetFromContractEnumerable } from "lib/knft-get";
  import { nftGetMetadata } from "lib/knft-get-metadata";
  import { collectionGet } from "lib/kcollection-get";

  import { hashArray } from "helpers/hash";
  import NftsList from "./NftsList.svelte";

  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <NftListGet {chainId} {collection}  {account} {refreshing} {platform} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account: string = undefined;
  export let refreshing = false;
  export let refresh = 0;

  let collectionObject: Collection;
  let numNFT: number;

  // Force NFts list refresh
  $: _nftsListForce(refresh).catch(console.error);

  const _nftsListForce = async (_refresh: number): Promise<void> =>
    await _nftsList(chainId, collection, account, _refresh);

  // Update NFTs list on chainId, collection or account change
  $: _nftsList(chainId, collection, account).catch(console.error);

  const _nftsList = async (_chainId: number, _collection: string, _account: string, _refresh = 0): Promise<void> => {
    if (!(_chainId && _collection && _account)) return;
    if (refreshing) return;

    refreshing = true;

    const hash = hashArray([_chainId, _collection, _account]);
    // console.log("hash _nftsList", hash, _chainId, _collection, _account);

    // collectionObject = collectionGetFromCache(_chainId, _collection);

    let _badCacheCount = false;

    if (_refresh === 0) {
      // LOAD nfts from cache
      const _nfts = _nftsListFromCache(_chainId, _collection, _account);
      _nftsSet(_nfts, hash);

      _badCacheCount = _nfts.size !== collectionObject?.balancesOf?.get(_account);
    } else {
      _nftsSet(new Map(), hash);
    }

    // REFRESH WHEN asked OR when NFTs count in cache not good
    if (_refresh > 0 || _badCacheCount) {
      // LOAD nfts from lib
      await _nftsListFromLib(_chainId, _collection, _account, hash);
    }

    refreshing = false;
  };

  const _nftsListFromCache = (_chainId: number, _collection: string, _account: string): Map<string, NftType> => {
    const _allNFTs = new Map();
    // const _allNFTs = nftListFromCache(_chainId, _collection, _account);
    // console.log("_nftsListFromCache _allNFTs", _allNFTs);

    const _nfts = _nftListFilter(_chainId, _collection, _account, _allNFTs);
    // console.log("_nftsListFromCache _nfts", _nfts);

    return _nfts;
  };

  const _nftListFilter = (
    _chainId: number,
    _collection: string,
    _account: string,
    _allNFTs: Map<string, NftType>
  ): Map<string, NftType> => {
    const _nfts = new Map(
      [..._allNFTs].filter(
        ([, nft]) => nft.chainId === _chainId && nft.collection === _collection && nft.owner === _account
      )
    );
    return _nfts;
  };

  const _nftsListFromLib = async (
    _chainId: number,
    _collection: string,
    _account: string,
    _hash: string
  ): Promise<void> => {
    if (_chainId && _collection && _account) {
      // console.log("_nftsListFromLib", _chainId, _collection, _account);

      collectionObject = await collectionGet(_chainId, _collection, $metamaskProvider, account);
      // console.log("_nftsListFromLib ~ collectionObject", collectionObject);

      // storeNftListClear(_chainId, _collection);

      // console.log("_nftsListFromLib", _chainId, _collection, _account, collectionObject);

      if (collectionObject.supports) {
        refreshing = true;

        if (collectionObject.supports.IERC721Enumerable) {
          const nNFTs = collectionObject.balancesOf?.get(account);
          // console.log("_nftsListFromLib= Enumerable ~ nNFTs", nNFTs);

          for (numNFT = 0; numNFT < nNFTs; numNFT++) {
            const nftIndex = await nftGetFromContractEnumerable(
              _chainId,
              collectionObject,
              numNFT,
              $metamaskProvider,
              _account
            );
            _nftSet(await nftGetMetadata(nftIndex), _hash);
          }
        } else {
          const nftsTokenIds = await nftListTokenIds(_chainId, collectionObject, $metamaskProvider, _account);
          // console.log("_nftsListFromLib= nbTokenIds ~ nNFTs", nftsTokenIds.size);

          for await (const _nft of nftsTokenIds.values()) {
            _nftSet(await nftGetMetadata(_nft), _hash);
          }
        }
      }
    }
  };

  let nfts: Map<string, NftType> = new Map();
  const _nftsSet = (_nfts: Map<string, NftType>, _hash: string): void => {
    const hash = hashArray([chainId, collection, account]);
    //  set when significant props have not changed
    if (hash === _hash) {
      nfts = _nfts;
      // console.log("set nfts", nfts);
    } else {
      // console.log("hash changed ", _hash, "=>", hash, chainId, collection, account);
    }
  };
  const _nftSet = (_nft: NftType, _hash: string): void => {
    //  set when significant props have not changed
    if (_hash === hashArray([chainId, collection, account])) {
      if (_nft?.nid) nfts.set(_nft.nid, _nft);
      // console.log("set nft", _nft);
      nfts = nfts; // needed in Svelte for Map reactivity !
    }
  };
</script>

<NftsList {nfts} {chainId} {collectionObject} {account} {refreshing} />
<!-- <NftsListSimple {nfts} /> -->
