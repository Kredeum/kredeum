<script lang="ts">
  import { onMount } from "svelte";

  import Collection from "../Collection/Collection.svelte";
  import CollectionGet from "../Collection/CollectionGet.svelte";

  import type { Collection as CollectionType } from "lib/ktypes";
  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { currentCollection } from "main/current";
  import {
    storeCollectionSet,
    storeCollectionSetDefaultAddress,
    storeCollectionGetDefaultMintableAddress,
    storeCollectionGetDefaultAddress,
    storeCollectionGet
  } from "lib/kstore";

  import { collectionGet } from "lib/kcollection-get";
  import { metamaskChainId, metamaskAccount, metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////

  /////////////////////////////////////////////////
  // <CollectionList {collections} {collection} {mintable} {txt} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let account: string = undefined;
  export let collection: string = undefined;
  export let mintable = false;
  export let label = true;
  export let txt = false;
  export let collections: Map<string, CollectionType>;
  export let refreshing: boolean;

  let defaultCollection: string;
  let defaultMintableCollection: string;
  let open = false;

  $: if (!chainId && $metamaskChainId) chainId = $metamaskChainId;
  $: if (!account && $metamaskAccount) account = $metamaskAccount;

  $: if (chainId) {
    console.log("CollectionList chainId", chainId);

    defaultMintableCollection = storeCollectionGetDefaultMintableAddress(chainId);
    defaultCollection = storeCollectionGetDefaultAddress(chainId, account) || defaultMintableCollection;

    _setCollection(mintable ? defaultMintableCollection : defaultCollection);
  }

  $: _collectionGet(collection).catch(console.error);
  const _collectionGet = async (collection: string): Promise<void> => {
    const storeCollection = storeCollectionGet(chainId, collection);
    const collectionObject = await collectionGet(chainId, storeCollection, $metamaskProvider, account);
    storeCollectionSet(collectionObject, account);
  };

  const _setCollection = (_collection: string) => {
    if (!(chainId && _collection)) return;

    console.log("_setCollection", chainId, _collection, account, collection);

    collection = _collection;
    currentCollection.set(collection);
    storeCollectionSetDefaultAddress(chainId, collection, account);
  };

  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);

  const _explorerCollectionUrl = (_collection: string): string => {
    const ret = explorerCollectionUrl(chainId, _collection);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collection: string): string => nftsUrl(chainId, _collection);

  const _toggleOpen = () => (open = !open);

  onMount(() => {
    console.log("CollectionList  onMount");
    if (!mintable) {
      window.addEventListener("click", (e: Event): void => {
        if (!(e.target as HTMLElement).closest(".select-collection")) open = false;
      });
    }
  });
</script>

{#if txt}
  <p>
    {#if collections?.size > 0}
      Collection
      {#if refreshing}...{/if}

      <select on:change={(e) => _setCollectionFromEvent(e)}>
        {#each [...collections] as [url, coll]}
          <option selected={coll.address == collection} value={coll.address}>
            <CollectionGet {chainId} collection={coll.address} {account} />
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
        {#if collections && collections.size > 0}
          <div class="select-trigger">
            <span>
              <CollectionGet {chainId} {collection} {account} />
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
