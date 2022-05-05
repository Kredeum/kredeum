<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "lib/ktypes";
  import { collectionUrl, explorerCollectionUrl } from "lib/kconfig";

  import Collection from "../Collection/Collection.svelte";
  import { collectionStore } from "stores/collection/collection";
  import { clickOutside } from "helpers/clickTools";

  /////////////////////////////////////////////////
  // <CollectionList chainId} bind:{address} {account} {mintable} {label} {txt} {refreshing} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  export let mintable: boolean = false;
  export let label: boolean = true;
  export let txt: boolean = false;
  export let refreshing: boolean = undefined;

  let open: boolean = false;
  let collections: Readable<Map<string, CollectionType>>;
  let collectionDefault: Readable<string>;

  // let i: number = 0;
  // HANDLE CHANGE : on truthy chainId and account, and whatever mintable
  $: mintable, chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    // console.log(`COLLECTION LIST CHANGE #${i++} ${collectionListKey(chainId, account, mintable)}`);

    // STATE VIEW : sync get Collections
    collections = collectionStore.getSubListStore(chainId, account, mintable);

    // STATE VIEW : sync get default Collection
    collectionDefault = collectionStore.getDefaultSubStore(chainId, mintable, account);

    // ACTION : async refresh Collections
    refreshing = true;
    await collectionStore.refreshSubList(chainId, account, mintable);
    refreshing = false;
    console.log("COLLECTIONS", $collections);

    // ACTION : sync refresh default Collections
    collectionStore.refreshDefault(chainId, account);
  };

  // $: $collectionDefault && logDefault();
  // const logDefault = () => console.log(`handleChange ${i} ${mintable} ~ collectionDefault`, $collectionDefault);

  // Current Collection is already defined, or is defined in url, or is default collection
  $: $collectionDefault && handleChangeAddress();
  const handleChangeAddress = (): string => (address = $collectionDefault);

  // STATE CHANGER : SET default Collection
  const _setCollection = (collection: string): void =>
    // address = collection;
    collectionStore.setDefaultOne(chainId, collection, mintable, account);

  // UTILITIES
  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);
  const _explorerCollectionUrl = (collection: string): string => explorerCollectionUrl(chainId, collection);
  const _collectionUrl = (collection: string): string => collectionUrl(chainId, collection);
</script>

{#if txt}
  <p>
    {#if $collections?.size > 0}
      Collection
      {#if refreshing}...{/if}

      <select on:change={_setCollectionFromEvent}>
        {#each [...$collections] as [key, coll]}
          <option id={key} selected={coll.address == address} value={coll.address}>
            <Collection chainId={coll.chainId} address={coll.address} {account} />
          </option>
        {/each}
      </select>
      <p>
        {collectionUrl(chainId, address)}
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
        {#if address}
          <a
            class="info-button"
            href={_explorerCollectionUrl(address)}
            title="&#009;  Collection address (click to view in explorer)&#013;
      {_collectionUrl(address)}"
            target="_blank"><i class="fas fa-info-circle" /></a
          >
        {/if}
      </span>
    {/if}
    <div
      class="select-wrapper select-storeCollection"
      use:clickOutside={() => (open = false)}
      on:click={() => (open = !open)}
    >
      <div class="select" class:open>
        {#if $collections?.size > 0}
          <div class="select-trigger">
            <span>
              <Collection {chainId} {address} {account} />
            </span>
          </div>
          <div class="custom-options">
            {#each [...$collections] as [key, coll]}
              <span
                id={key}
                class="custom-option {coll.address == address ? 'selected' : ''}"
                data-value={coll.address}
                on:click={() => _setCollection(coll.address)}
              >
                <Collection chainId={coll.chainId} address={coll.address} {account} />
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
