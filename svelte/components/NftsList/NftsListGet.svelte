<script lang="ts">
  import { onMount } from "svelte";

  import { hashArray } from "helpers/hash";
  import type { Collection, Nft as NftType } from "lib/ktypes";

  import { nftListTokenIds, nftListFromCache } from "lib/knft-list";
  import { nftGetFromContractEnumerable } from "lib/knft-get";
  import { nftGetMetadata } from "lib/knft-get-metadata";

  import { collectionGet, collectionGetFromCache } from "lib/kcollection-get";
  import { cacheClear } from "lib/kcache";

  import NftsList from "./NftsList.svelte";
  import NftsListSimple from "./NftsListSimple.svelte";

  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <NftListGet {chainId} {collection}  {account} {refreshing} {platform} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account: string = undefined;
  export let refreshing = true;
  export let platform = ""; // platform : wordPress or dapp

  let refresh = true;

  let collectionObject: Collection;
  let numNFT: number;

  let allNFTs: Map<string, NftType>;
  let mores: Array<number> = [];

  $: if (refreshing) _nftsList(chainId, collection, account);

  // current hash of significant props
  $: hashCurrent = hashArray([chainId, collection, account]);

  let nfts: Map<string, NftType>;
  const _nftsSet = (_NFTs: Map<string, NftType>, _hash: string): void => {
    //  set when significant props have not changed
    if (_hash === hashCurrent) nfts = _NFTs;
  };

  $: _nftsList(chainId, collection, account, true).catch(console.error);

  const _nftsList = async (_chainId: number, _collection: string, _account: string, cache = false) => {
    if (!(_chainId && _collection && _account)) return;

    console.log("_nftsList", _chainId, _collection, _account, cache);

    collectionObject = collectionObject || collectionGetFromCache(_chainId, _collection);
    console.log("_nftsList= ~ collectionObject", collectionObject);

    let fromLib = !cache;

    if (cache) {
      // LOAD nfts from cache
      const nn = _nftsListFromCache(_chainId, _collection, _account);
      console.log("const_nftsList= ~ nfts", nn);

      // REFRESH LIB WHEN NFT count found in cache not good
      fromLib = nn !== collectionObject.balanceOf;
    }

    if (fromLib) {
      // LOAD nfts from lib
      await _nftsListFromLib(_chainId, _collection, _account);
    }
    refresh = !refresh;

    console.log("_nftsList allNFTs", _chainId, _collection, _account, allNFTs, nfts);
  };

  const _nftsListFromCache = (_chainId: number, _collection: string, _account: string): number => {
    const hash = hashArray([_chainId, _collection, _account]);

    allNFTs = nftListFromCache(_chainId, _collection, _account);
    console.log("_nftsListFromCache allNFTs", allNFTs);

    nfts = new Map(
      [...allNFTs].filter(
        ([, nft]) => nft.chainId === _chainId && nft.collection === _collection && nft.owner === _account
      )
    );
    refresh = !refresh;

    console.log("_nftsListFromCache", nfts?.size, nfts);
    return nfts?.size;
  };

  const _nftsListFromLib = async (_chainId: number, _collection: string, _account: string) => {
    if (_chainId && _collection && _account) {
      console.log("_nftsListFromLib", _chainId, _collection, account);

      collectionObject = await collectionGet(_chainId, _collection, $metamaskProvider, account);
      console.log("_nftsListFromLib ~ collectionObject", collectionObject);

      cacheClear(_chainId, _collection);

      mores = [];
      nfts = new Map();

      console.log("_nftsListFromLib", _chainId, _collection, _account, collectionObject);

      if (collectionObject.supports) {
        refreshing = true;

        if (collectionObject.supports.IERC721Enumerable) {
          const nNFTs = collectionObject.balanceOf;
          console.log("_nftsListFromLib= Enumerable ~ nNFTs", nNFTs);

          for (numNFT = 0; numNFT < nNFTs; numNFT++) {
            const nftIndex = await nftGetFromContractEnumerable(
              _chainId,
              collectionObject,
              numNFT,
              $metamaskProvider,
              _account
            );
            const nft = await nftGetMetadata(nftIndex);
            if (nft?.nid) nfts.set(nft.nid, nft);
            nfts = nfts; // needed in Svelte for Map reactivity !
          }
        } else {
          const nftsTokenIds = await nftListTokenIds(_chainId, collectionObject, $metamaskProvider, _account);
          console.log("_nftsListFromLib= nbTokenIds ~ nNFTs", nftsTokenIds.size);

          for await (const _nft of nftsTokenIds.values()) {
            const nft = await nftGetMetadata(_nft);
            if (nft?.nid) nfts.set(nft.nid, nft);
            nfts = nfts; // needed in Svelte for Map reactivity !
          }
        }

        refreshing = false;
        // console.log("_nftsListFromLib OUT =>", nfts?.size, nfts);
      } else {
        console.error("_nftsListFromLib Collection not ready", _collection);
      }
      refresh = !refresh;
      console.log("_nftsListFromLib ~ nfts", nfts);
    }
  };

  onMount(() => {
    console.log("NftsListData onMount");
  });
</script>

<NftsList {nfts} {chainId} {collectionObject} {account} {platform} />
<!-- <NftsListSimple {nfts} /> -->
