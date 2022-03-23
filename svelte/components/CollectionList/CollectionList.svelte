<script lang="ts">
  import { onMount } from "svelte";

  import Collection from "../Collection/Collection.svelte";
  import CollectionGet from "../Collection/CollectionGet.svelte";

  import type { Collection as CollectionType } from "lib/ktypes";
  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { currentCollection } from "main/current";

  import { refNft } from "helpers/urlHash";
  import { collectionGet } from "lib/kcollection-get";
  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <CollectionList {collections} {collection} {minting} {txt} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account: string;
  export let minting = false;
  export let txt = false;
  export let collections: Map<string, CollectionType>;

  let defaultCollection: string;
  let defaultMintableCollection: string;
  let refreshingCollections: boolean;
  let open = false;

  $: if (collection) {
    console.log("CollectionList collection", collection);

    localStorage.setItem(`defaultCollection/${chainId}/${account}`, collection);
  }

  $: if (chainId) {
    console.log("CollectionList chainId", chainId);

    defaultMintableCollection = localStorage.getItem(`defaultMintableCollection/${chainId}`) || "";
    defaultCollection = localStorage.getItem(`defaultCollection/${chainId}/${account}`) || defaultMintableCollection;

    _setCollection(collection || refNft().collection || (minting ? defaultMintableCollection : defaultCollection));
  }

  const _setCollection = (_collection: string): string => (collection = _collection);
  const _setCollectionFromEvent = (evt: Event): string => _setCollection((evt.target as HTMLInputElement).value);

  const _explorerCollectionUrl = (_collection: string): string => {
    const ret = explorerCollectionUrl(chainId, _collection);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collection: string): string => nftsUrl(chainId, _collection);

  $: if (collection) {
    console.log("CollectionSelect collection", collection);
    currentCollection.set(collection);
  }

  onMount(() => {
    console.log("CollectionList  onMount");

    window.addEventListener("click", (e: Event): void => {
      if (!minting && !document.querySelector(".select-collection")?.contains(e.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

{#if txt}
  <p>
    {#if collections}
      {#if collections.size > 0}
        Collection
        <select on:change={(e) => _setCollectionFromEvent(e)}>
          {#each [...collections] as [url, coll]}
            <option selected={coll.address == collection} value={coll.address}>
              <CollectionGet {chainId} collection={coll.address} />
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
  </p>
{:else}
  <div class="col col-xs-12 col-sm-3">
    <span class="label"
      >Collection
      {#if collection}
        <a
          class="info-button"
          href={_explorerCollectionUrl(collection)}
          title="&#009;  Collection address (click to view in explorer)&#013;
      {_nftsUrl(collection)}"
          target="_blank"><i class="fas fa-info-circle" /></a
        >
      {/if}
    </span>
    <div class="select-wrapper select-collection" on:click={() => (open = !open)}>
      <div class="select" class:open>
        {#key refreshingCollections}
          {#if collections && collections.size > 0}
            <div class="select-trigger">
              <span>
                <CollectionGet {chainId} {collection} {account} />
              </span>
            </div>
            <div class="custom-options">
              {#each [...collections] as [url, coll]}
                {#if !minting || coll.mintable}
                  <span
                    class="custom-option {coll.address == collection ? 'selected' : ''}"
                    data-value={coll.address}
                    on:click={() => _setCollection(coll.address)}
                  >
                    <Collection collectionObject={coll} />
                  </span>
                {/if}
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
  </div>
{/if}
