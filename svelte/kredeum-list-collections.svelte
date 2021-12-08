<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import { listCollections, listCollectionsFromCache } from "lib/klist-collections";
  import { nftsUrl, urlOwner, getOpenNFTsAddress } from "lib/kconfig";
  import { collectionName } from "lib/knfts";
  import { onMount } from "svelte";

  // down to component
  export let chainId: number = undefined;
  export let owner: string = undefined;
  export let filter = false;
  export let txt = false;
  // up to parent
  export let collection: Collection = undefined;

  let collectionAddress: string;
  let allCollections: Map<string, Collection>;
  let collections: Map<string, Collection>;
  let refreshingCollections: boolean;
  let open = false;

  const _setCollection = async (_collectionAddress: string): Promise<void> => {
    if (_collectionAddress && collectionAddress !== _collectionAddress) {
      collectionAddress = _collectionAddress;
      
      console.log("KredeumListCollections _setCollection", collectionAddress);

      if (chainId && owner && collectionAddress) {
        localStorage.setItem(`defaultCollection/${chainId}/${owner}`, collectionAddress);
        collection = allCollections.get(urlOwner(nftsUrl(chainId, collectionAddress), owner));
      } else {
        collection = null;
      }
    }
  };

  // ON CHAINID or OWNER change THEN list collections
  $: _listCollections(chainId, owner);

  const _listCollections = async (_chainId: number, _owner: string): Promise<void> => {
    console.log("KredeumListCollections _listCollections", _chainId, _owner);
    if (_chainId && _owner) {
      _listCollectionsFromCache(_chainId, _owner);

      refreshingCollections = true;
      allCollections = await listCollections(_chainId, _owner);
      refreshingCollections = false;

      _listCollectionsFromCache(_chainId, _owner);
    }
  };

  const _listCollectionsFromCache = async (_chainId: number, _owner: string) => {
    console.log("KredeumListCollections _listCollectionsFromCache");
    allCollections = listCollectionsFromCache(_owner);

    collections = new Map(
      [...allCollections]
        .filter(([, collection]) => {
          return (
            // FILTER NETWORK
            collection.chainId === _chainId &&
            // FILTER COLLECTION NOT EMPTY OR MINE OR DEFAULT
            (collection.balanceOf > 0 ||
              collection.owner === _owner ||
              collection.address === getOpenNFTsAddress(chainId)) &&
            // FILTER OpenNFTs collection
            (!filter || collection.openNFTsVersion)
          );
        })
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
    );

    // SET DEFAULT COLLECTION
    const defaultCollection =
      localStorage.getItem(`defaultCollection/${_chainId}/${_owner}`) ||
      getOpenNFTsAddress(chainId);
    _setCollection(defaultCollection);
    // console.log(collections);
  };

  const collectionBalanceOf = (collContract: Collection) =>
    collContract?.balanceOf || (collContract?.balanceOf == 0 ? "0" : "?");
  const collectionNameAndBalanceOf = (collContract: Collection) =>
    collContract
      ? `${collectionName(collContract)} (${collectionBalanceOf(collContract)})`
      : "Choose collection";

  onMount(async () => {
    window.addEventListener("click", (e: Event): void => {
      if (
        !filter &&
        !document.querySelector(".select-collection")?.contains(e.target as HTMLElement)
      ) {
        open = false;
      }
    });
  });
</script>

{#if txt}
  {#if collections}
    {#if collections.size > 0}
      Collection
      <select on:change={(e) => _setCollection(e.target.value)}>
        {#each [...collections] as [url, coll]}
          <option selected={coll.address == collectionAddress} value={coll.address}>
            {collectionNameAndBalanceOf(coll)}
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
    {#if collections}
      {#if collections.size > 0}
        <div class="select" class:open>
          <div class="select-trigger">
            <span>{collectionNameAndBalanceOf(collection)}</span>
          </div>
          <div class="custom-options">
            {#each [...collections] as [url, coll]}
              <span
                class="custom-option {coll.address == collectionAddress ? 'selected' : ''}"
                data-value={coll.address}
                on:click={() => _setCollection(coll.address)}
              >
                {collectionNameAndBalanceOf(coll)}
              </span>
            {/each}
          </div>
        </div>
      {:else}
        <p><em>NO Collection found !</em></p>
      {/if}
    {:else}
      <p>
        {#if refreshingCollections}
          Refreshing Collection list...
        {/if}
      </p>
    {/if}
  </div>
{/if}
