<script lang="ts">
  import type { Readable } from "svelte/store";
  import { onMount } from "svelte";

  import Collection from "../Collection/Collection.svelte";
  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { collectionDefault, collectionDefaultSet } from "main/collectionDefault";
  import { collectionList } from "stores/collectionList";
  import { collectionListFilter } from "stores/collectionListFilter";
  import type { Collection as CollectionType } from "lib/ktypes";

  /////////////////////////////////////////////////
  // <CollectionList chainId} {account} bind:{collection} {mintable} {label} {txt} {refreshing} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let account: string = undefined;
  export let collection: string = undefined;
  export let mintable = false;
  export let label = true;
  export let txt = false;
  export let refreshing: boolean = undefined;

  let open = false;
  let collections: Readable<Map<string, CollectionType>>;

  // async update of filtered collection list
  $: collectionList.updateFilter(chainId, account);

  // get derived stored for chainId and account
  $: collections = collectionListFilter(chainId, account, mintable);

  // $: console.log($collections);

  const _setCollection = (_collection: string) => {
    if (!(chainId && _collection)) return;

    console.log("_setCollection", chainId, _collection);
    collection = _collection;
    collectionDefaultSet(chainId, account, collection);
  };

  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);

  const _explorerCollectionUrl = (_collection: string): string => explorerCollectionUrl(chainId, _collection);

  const _nftsUrl = (_collection: string): string => nftsUrl(chainId, _collection);

  const _toggleOpen = () => (open = !open);

  onMount(() => {
    if (!mintable) {
      window.addEventListener("click", (e: Event): void => {
        if (!(e.target as HTMLElement).closest(".select-collection")) open = false;
      });
    }
  });
</script>

{#if txt}
  <p>
    {#if $collections?.size > 0}
      Collection
      {#if refreshing}...{/if}

      <select on:change={(e) => _setCollectionFromEvent(e)}>
        {#each [...$collections] as [url, coll]}
          <option selected={coll.address == collection} value={coll.address}>
            <Collection chainId={coll.chainId} collection={coll.address} {account} />
          </option>
        {/each}
      </select>
      <p>
        {nftsUrl(chainId, collection)}
      </p>
    {:else}
      <p>
        {#if refreshing}
          Refreshing collections...
        {:else}
          NO Collection found !
        {/if}
      </p>
    {/if}
  </p>
{:else}
  <div class="col col-xs-12 col-sm-{mintable ? '8' : '3'}">
    {#if label}
      <span class="label"
        >Collection
        {#if refreshing}...{/if}
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
    {/if}

    <div class="select-wrapper select-collection" on:click={_toggleOpen}>
      <div class="select" class:open>
        {#if $collections?.size > 0}
          <div class="select-trigger">
            <span>
              <Collection {chainId} {collection} {account} />
            </span>
          </div>
          <div class="custom-options">
            {#each [...$collections] as [url, coll]}
              <span
                class="custom-option {coll.address == collection ? 'selected' : ''}"
                data-value={coll.address}
                on:click={() => _setCollection(coll.address)}
              >
                <Collection chainId={coll.chainId} collection={coll.address} {account} />
              </span>
            {/each}
          </div>
        {:else}
          <div class="select-trigger">
            <em>
              {#if refreshing}
                Refreshing collections...
              {:else}
                NO Collection found !
              {/if}
            </em>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
