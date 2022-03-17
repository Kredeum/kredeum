<script lang="ts">
  import { onMount } from "svelte";

  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionList, collectionListFromCache } from "lib/kcollection-list";
  import { collectionGet } from "lib/kcollection-get";
  import { factoryGetDefaultImplementation } from "lib/kfactory-get";
  import { collectionName, nftsUrl, urlOwner } from "lib/kconfig";

  import { metamaskProvider } from "main/metamask";

  import { hashObject } from "helpers/hash";
  import Collection from "./collection.svelte";

  // down to component
  export let chainId: number;
  export let account: string;
  export let minting = false;
  export let txt = false;
  // up to parent
  export let collection: CollectionType = undefined;

  let collectionAddress: string;
  let allCollections: Map<string, CollectionType>;
  let collections: Map<string, CollectionType>;
  let refreshingCollections: boolean;
  let open = false;

  const _setCollectionFromEvent = async (e: Event): Promise<void> => {
    return _setCollection((e.target as HTMLInputElement).value);
  };

  const _setCollection = async (_collectionAddress: string): Promise<void> => {
    if (_collectionAddress) {
      collectionAddress = _collectionAddress;

      // console.log("KredeumListCollections _setCollection", collectionAddress);
      collection = null;

      if (chainId && account && collectionAddress) {
        localStorage.setItem(`defaultCollection/${chainId}/${account}`, collectionAddress);
        const coll = allCollections.get(urlOwner(nftsUrl(chainId, collectionAddress), account));
        if (coll) {
          collection = await collectionGet(chainId, coll, $metamaskProvider);
          console.log("Collection", collection);
        }
      }
    }
  };

  // IF CHAINID or OWNER change THEN list collections
  $: _collectionList(chainId, account).catch(console.error);

  const _collectionList = async (_chainId: number, _owner: string): Promise<void> => {
    if (_chainId && _owner) {
      // console.log("KredeumListCollections _collectionList", _chainId, _owner);

      await _collectionListFromCache(_chainId, _owner);

      refreshingCollections = true;
      allCollections = await collectionList(_chainId, _owner, $metamaskProvider);
      refreshingCollections = false;

      await _collectionListFromCache(_chainId, _owner);
    }
  };

  const _collectionListFromCache = async (_chainId: number, _owner: string) => {
    // console.log("KredeumListCollections _collectionListFromCache", _chainId, _owner);

    allCollections = collectionListFromCache(_owner);

    // SET DEFAULT COLLECTION
    const defaultMintableCollection = await factoryGetDefaultImplementation(_chainId, $metamaskProvider);
    const defaultCollection =
      localStorage.getItem(`defaultCollection/${_chainId}/${_owner}`) || defaultMintableCollection;

    collections = new Map(
      [...allCollections]
        .filter(([, coll]) => {
          // SAME NETWORK
          const okNetwork = coll.chainId === _chainId;

          // Collection IS a mintable collection that I own OR default mintable collection
          const okMintable =
            (Boolean(coll.mintable) && coll.owner === _owner) || coll.address == defaultMintableCollection;

          // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
          const okAll = !minting && (coll.owner === _owner || coll.balanceOf > 0 || coll.address == defaultCollection);

          return okNetwork && (okMintable || okAll);
        })

        // )
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
    );

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
    if (_urlCollection && _urlCollection != collectionAddress) {
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
          <option selected={coll.address == collectionAddress} value={coll.address}>
            <Collection {collection} />
          </option>
        {/each}
      </select>
      {nftsUrl(chainId, collectionAddress)}
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
              <Collection {collection} {minting} />
            </span>
          </div>
          <div class="custom-options">
            {#each [...collections] as [url, coll]}
              <span
                class="custom-option {coll.address == collectionAddress ? 'selected' : ''}"
                data-value={coll.address}
                on:click={() => _setCollection(coll.address)}
              >
                <Collection collection={coll} />
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
