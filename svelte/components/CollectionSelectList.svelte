<script lang="ts">
  import { onMount } from "svelte";

  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionList } from "lib/kcollection-list";
  import { cacheCollectionsList } from "lib/kcache";
  import { collectionGet } from "lib/kcollection-get";
  import { factoryGetDefaultImplementation } from "lib/kfactory-get";
  import { nftsUrl, urlOwner } from "lib/kconfig";

  import { metamaskProvider } from "main/metamask";

  import { hashObject } from "helpers/hash";
  import Collection from "./Collection.svelte";

  /////////////////////////////////////////////////
  // <CollectionSelectList {chainId} {account} bind:{collection} {minting} {txt} />
  // Select Collection via List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let account: string;
  export let collection: string = undefined;
  export let minting = false;
  export let txt = false;

  let collectionObject: CollectionType;
  let allCollections: Map<string, CollectionType>;
  let collections: Map<string, CollectionType>;
  let refreshingCollections: boolean;
  let open = false;

  const _setCollectionFromEvent = async (e: Event): Promise<void> => {
    return _setCollection((e.target as HTMLInputElement).value);
  };

  const _setCollection = async (_collection: string): Promise<void> => {
    if (_collection) {
      collection = _collection;

      // console.log("KredeumListCollections _setCollection", collectionAddress);
      collectionObject = null;

      if (chainId && account && collection) {
        localStorage.setItem(`defaultCollection/${chainId}/${account}`, collection);
        const coll = allCollections.get(urlOwner(nftsUrl(chainId, collection), account));
        if (coll) {
          collectionObject = await collectionGet(chainId, coll, $metamaskProvider);
          console.log("Collection", collectionObject);
        }
      }
    }
  };

  // IF CHAINID or OWNER change THEN list collections
  $: _collectionList(chainId, account);

  const _collectionList = async (_chainId: number, _account: string): Promise<void> => {
    if (_chainId && _account) {
      console.log("_collectionList", _chainId, _account);

      await _cacheCollectionsList(_chainId, _account);

      refreshingCollections = true;
      allCollections = await collectionList(_chainId, _account, $metamaskProvider);
      refreshingCollections = false;

      await _cacheCollectionsList(_chainId, _account);
    }
  };

  const _cacheCollectionsList = async (_chainId: number, _account: string) => {
    allCollections = cacheCollectionsList(_chainId, _account);
    console.log("const_cacheCollectionsList= ~ allCollections", allCollections);

    // SET DEFAULT COLLECTION
    const defaultMintableCollection = await factoryGetDefaultImplementation(_chainId, $metamaskProvider);

    const defaultCollection =
      localStorage.getItem(`defaultCollection/${_chainId}/${_account}`) || defaultMintableCollection;

    collections = new Map(
      [...allCollections]
        .filter(([, coll]) => {
          // SAME NETWORK
          const okNetwork = coll.chainId === _chainId;

          // Collection IS a mintable collection that I own OR default mintable collection
          const okMintable =
            (Boolean(coll.mintable) && coll.owner === _account) || coll.address == defaultMintableCollection;

          // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
          const okAll =
            !minting && (coll.owner === _account || coll.balanceOf > 0 || coll.address == defaultCollection);

          return okNetwork && (okMintable || okAll);
        })

        // )
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
    );
    // console.log("_cacheCollectionsList ~ collections", collections);

    await _setCollection(defaultCollection);
  };

  onMount(async () => {
    window.addEventListener("click", (e: Event): void => {
      if (!minting && !document.querySelector(".select-collection")?.contains(e.target as HTMLElement)) {
        open = false;
      }
    });

    // IF collection requested in url is different THEN set collection
    const _urlCollection = hashObject().collection;
    if (_urlCollection && _urlCollection != collection) {
      _setCollection(_urlCollection);
    }
  });
</script>

{#if txt}
  {#if collections}
    {#if collections.size > 0}
      Collection
      <select on:change={(e) => _setCollectionFromEvent(e)}>
        {#each [...collections] as [url, coll]}
          <option selected={coll.address == collection} value={coll.address}>
            <Collection {collectionObject} />
          </option>
        {/each}
      </select>
      {nftsUrl(chainId, collection)}
    {:else}
      NO Collection found !
    {/if}
  {:else if refreshingCollections}
    Refreshing Collection list...
  {/if}
{:else}
  <div class="select-wrapper select-collection" on:click={() => (open = !open)}>
    <div class="select" class:open>
      {#key refreshingCollections}
        {#if collections && collections.size > 0}
          <div class="select-trigger">
            <span>
              <Collection {collectionObject} {minting} />
            </span>
          </div>
          <div class="custom-options">
            {#each [...collections] as [url, coll]}
              <span
                class="custom-option {coll.address == collection ? 'selected' : ''}"
                data-value={coll.address}
                on:click={() => _setCollection(coll.address)}
              >
                <Collection collectionObject={coll} />
              </span>
            {/each}
          </div>
        {:else if refreshingCollections}
          <div class="select-trigger">Refreshing Collection list...</div>
        {:else}
          <div class="select-trigger"><em>NO Collection found !</em></div>
        {/if}
      {/key}
    </div>
  </div>
{/if}
