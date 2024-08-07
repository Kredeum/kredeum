<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType } from "@kredeum/common/src/common/types";

  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import { ADDRESS_ZERO, explorerCollectionUrl, isAddressNotZero } from "@kredeum/common/src/common/config";

  import Collection from "./Collection.svelte";
  import { clickOutside } from "../../helpers/clickOutside";

  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import { keyCollection } from "@kredeum/common/src/common/keys";
  import { collectionSubListRefresh, collectionSubListStore } from "../../stores/collection/collectionSubList";
  import {
    collectionDefaultRefresh,
    collectionDefaultSetOne,
    collectionDefaultSubStore
  } from "../../stores/collection/collectionDefault";

  /////////////////////////////////////////////////
  // <CollectionSelect chainId} bind:{address} {account} {mintable}  bind:{refreshing} {label} {txt} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string | undefined = undefined;
  export let account: string | undefined = ADDRESS_ZERO;
  export let mintable: boolean = false;
  export let txt: boolean = false;
  export let label: boolean = true;
  export let refreshing: boolean = false;

  let refreshAll: Writable<number> = getContext("refreshAll");

  let open: boolean = false;
  let collections: Readable<Map<string, CollectionType>>;
  let collectionDefault: Readable<string>;

  // let i: number = 0;
  // HANDLE CHANGE : on truthy chainId and account, and whatever mintable
  $: $refreshAll, mintable, account && chainId && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    // console.log(`COLLECTION LIST CHANGE #${i++} ${keyCollection(chainId, account || ADDRESS_ZERO)}`);

    // STATE VIEW : sync get Collections
    collections = collectionSubListStore(chainId, account, undefined, mintable);
    // console.log("COLLECTIONS cached", $collections);

    // STATE VIEW : sync get default Collection
    collectionDefault = collectionDefaultSubStore(chainId, mintable, account);

    // ACTION : async refresh Collections
    refreshing = true;
    await collectionSubListRefresh(chainId, account, undefined, mintable);
    refreshing = false;
    console.info("COLLECTIONS", $collections);

    // ACTION : sync refresh default Collections
    collectionDefaultRefresh(chainId, account);
  };

  // $: $collectionDefault && logDefault();
  // const logDefault = () => console.log(`handleChange ${i} ${mintable} ~ collectionDefault`, $collectionDefault);

  // Current Collection is already defined, or is defined in url, or is default collection
  $: $collectionDefault && handleChangeAddress();
  const handleChangeAddress = (): void => {
    // console.log("handleChangeAddress ~ $collectionDefault:", $collectionDefault);
    if (isAddressNotZero(address)) return;
    address = $collectionDefault;
  };

  // STATE CHANGER : SET default Collection
  const _setCollection = (collection: string, mintable_ = mintable): void => {
    // console.log("<CollectionSelect _setCollection", collection);
    if (!isAddressNotZero(collection)) return;
    address = collection;
    collectionDefaultSetOne(chainId, collection, mintable_, account);
  };

  // UTILITIES
  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);
  const _explorerCollectionUrl = (collection: string): string => explorerCollectionUrl(chainId, collection);
  const _collectionUrl = (collection: string): string => keyCollection(chainId, collection);

  const handleToggleOpen = () => (open = !open);
</script>

{#if txt}
  <p>
    {#if $collections?.size > 0}
      {#if label}Collection{#if refreshing}...{/if}{/if}

      <select on:change={_setCollectionFromEvent}>
        {#each [...$collections] as [key, coll]}
          <option id={key} selected={coll.address == address} value={coll.address}>
            <Collection chainId={coll.chainId} address={coll.address} {account} />
          </option>
        {/each}
      </select>
      {#if label && address && isAddressNotZero(address)}
        <p>{keyCollection(chainId, address, account)}</p>
      {/if}
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
  {#if label}
    <span class="label"
      >Collection
      {#if refreshing}...{/if}
      {#if address && isAddressNotZero(address)}
        <a
          class="info-button"
          href={_explorerCollectionUrl(address)}
          title="Collection address (click to view in explorer)&#013;
      {_collectionUrl(address)}"
          target="_blank"
          rel="noreferrer"><i class="fas fa-info-circle" /></a
        >
        <CopyRefItem copyData={address} />
      {/if}
    </span>
  {/if}
  <div
    role="button"
    tabindex="0"
    class="select-wrapper select-storeCollection"
    use:clickOutside={() => (open = false)}
    on:click={handleToggleOpen}
    on:keydown={handleToggleOpen}
  >
    <div class="select" class:open>
      {#if address && isAddressNotZero(address) && $collections?.size > 0}
        <div class="select-trigger">
          <span>
            <Collection {chainId} {address} {account} />
          </span>
        </div>
        <div class="custom-options">
          {#each [...$collections] as [key, coll]}
            <span
              role="button"
              tabindex="0"
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
{/if}
