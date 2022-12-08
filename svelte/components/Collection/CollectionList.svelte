<script lang="ts">
  import { Readable, writable } from "svelte/store";
  import type { CollectionType } from "@lib/common/types";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { collectionKey, explorerCollectionUrl } from "@lib/common/config";

  import Collection from "../Collection/Collection.svelte";
  import { collectionStore } from "@stores/collection/collection";
  import { clickOutside } from "@helpers/clickOutside";

  import CopyRefItem from "../Global/CopyRefItem.svelte";

  /////////////////////////////////////////////////
  // <CollectionList chainId} bind:{address} {account} {mintable} {label} {txt} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  export let mintable: boolean = false;
  export let label: boolean = true;
  export let txt: boolean = false;

  // Context for refreshCollectionList & refreshing
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshing: Writable<boolean> = txt ? writable(false) : getContext("refreshing");
  ///////////////////////////////////////////////////////////

  let open: boolean = false;
  let collections: Readable<Map<string, CollectionType>>;
  let collectionDefault: Readable<string>;

  // let i: number = 0;
  // HANDLE CHANGE : on truthy chainId and account, and whatever mintable
  $: $refreshCollectionList, mintable, chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    // console.log(`COLLECTION LIST CHANGE #${i++} ${collectionListKey(chainId, account, mintable)}`);

    // STATE VIEW : sync get Collections
    collections = collectionStore.getSubListStore(chainId, account, mintable);

    // STATE VIEW : sync get default Collection
    collectionDefault = collectionStore.getDefaultSubStore(chainId, mintable, account);
    console.info("COLLECTIONS cached", $collections);

    // ACTION : async refresh Collections
    $refreshing = true;
    await collectionStore.refreshSubList(chainId, account, mintable);
    $refreshing = false;
    console.info("COLLECTIONS refreshed", $collections);

    // ACTION : sync refresh default Collections
    collectionStore.refreshDefault(chainId, account);
  };

  // $: $collectionDefault && logDefault();
  // const logDefault = () => console.log(`handleChange ${i} ${mintable} ~ collectionDefault`, $collectionDefault);

  // Current Collection is already defined, or is defined in url, or is default collection
  $: $collectionDefault && account && handleChangeAddress();
  const handleChangeAddress = (): void => {
    address ||= $collectionDefault;
  };

  // STATE CHANGER : SET default Collection
  const _setCollection = (collection: string, mintable_ = mintable): void => {
    address = collection;
    collectionStore.setDefaultOne(chainId, collection, mintable_, account);
  };

  // UTILITIES
  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);
  const _explorerCollectionUrl = (collection: string): string => explorerCollectionUrl(chainId, collection);
  const _collectionUrl = (collection: string): string => collectionKey(chainId, collection);

  const handleToggleOpen = () => (open = !open);
</script>

{#if txt}
  <p>
    {#if $collections?.size > 0}
      Collection
      {#if $refreshing}...{/if}

      <select on:change={_setCollectionFromEvent}>
        {#each [...$collections] as [key, coll]}
          <option id={key} selected={coll.address == address} value={coll.address}>
            <Collection chainId={coll.chainId} address={coll.address} {account} />
          </option>
        {/each}
      </select>
      <p>
        {collectionKey(chainId, address)}
      </p>
    {:else}
      <p>
        {#if $refreshing}
          Refreshing collections...
        {:else}
          NO Collection found !
        {/if}
      </p>
    {/if}
  </p>
{:else}
  <div class="col col-xs-12 col-sm-{mintable ? '12' : '3'} kre-copy-ref-container">
    {#if label}
      <span class="label"
        >Collection
        {#if $refreshing}...{/if}
        {#if address}
          <a
            class="info-button"
            href={_explorerCollectionUrl(address)}
            title="&#009;  Collection address (click to view in explorer)&#013;
      {_collectionUrl(address)}"
            target="_blank"
            rel="noreferrer"><i class="fas fa-info-circle" /></a
          >
          <CopyRefItem copyData={address} />
        {/if}
      </span>
    {/if}
    <div
      class="select-wrapper select-storeCollection"
      use:clickOutside={() => (open = false)}
      on:click={handleToggleOpen}
      on:keydown={handleToggleOpen}
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
                on:keydown={() => _setCollection(coll.address)}
              >
                <Collection chainId={coll.chainId} address={coll.address} {account} />
              </span>
            {/each}
          </div>
        {:else}
          <div class="select-trigger">
            <em>
              {#if $refreshing}
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
