<script lang="ts">
  import type { Readable } from "svelte/store";
  import { onMount } from "svelte";

  import type { CollectionType } from "lib/ktypes";
  import { collectionUrl, explorerCollectionUrl } from "lib/kconfig";

  import Collection from "../Collection/Collection.svelte";
  import { collectionDefaultStore } from "stores/collection/collectionDefault";
  import { collectionListStore } from "stores/collection/collectionList";

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

  // // ACTION : refresh Collections async
  // $: collectionListStore
  //   .refresh(chainId, account, mintable)
  //   .then(() => (refreshing = false))
  //   .catch(console.error);

  // // STATE VIEW : get Collections sync
  // $: collections = collectionListStore.getSubList(chainId, account, mintable);

  let i = 1;
  let j = 1;

  // ACTION : refresh Collections async
  $: if (chainId && account) _refresh(chainId, account, mintable);
  const _refresh = async (_chainId: number, _account: string, _mintable: boolean): Promise<void> => {
    refreshing = true;
    await collectionListStore.refresh(_chainId, _account, _mintable);
    refreshing = false;
    console.log(
      `REFRESH COLLECTION LIST ${i++} collection://${_chainId}${_account ? "@" + _account : ""} ${String(_mintable)}`
    );
  };

  // STATE VIEW : get Collections sync
  $: if (chainId && account) _get(chainId, account, mintable);
  const _get = (_chainId: number, _account: string, _mintable: boolean): void => {
    collections = collectionListStore.getSubList(_chainId, _account, _mintable);
    console.log(
      `GET COLLECTION LIST ${j++} collection://${_chainId}${_account ? "@" + _account : ""} ${String(_mintable)}\n`,
      $collections
    );
  };

  // ACTION : refresh default Collections sync
  $: collectionDefaultStore.refresh(chainId, account);

  // STATE VIEW : Collections
  $: collectionDefault = collectionDefaultStore.getDefault(chainId, mintable, account);
  $: address = $collectionDefault;

  const _setCollection = (_collection: string): string => {
    if (!(chainId && _collection)) return;

    // console.log("_setCollection", chainId, _collection);
    address = _collection;
    collectionDefaultStore.setOne(chainId, _collection, mintable, account);

    return address;
  };

  const _setCollectionFromEvent = (evt: Event) => _setCollection((evt.target as HTMLInputElement).value);

  const _explorerCollectionUrl = (_collection: string): string => explorerCollectionUrl(chainId, _collection);

  const _collectionUrl = (_collection: string): string => collectionUrl(chainId, _collection);

  const _toggleOpen = () => (open = !open);

  onMount(() => {
    if (!mintable) {
      window.addEventListener("click", (e: Event): void => {
        if (!(e.target as HTMLElement).closest(".select-storeCollection")) open = false;
      });
    }
  });
</script>

<!-- {@debug address} -->

{#if txt}
  <p>
    {#if $collections?.size > 0}
      Collection
      {#if refreshing}...{/if}

      <select on:change={(e) => _setCollectionFromEvent(e)}>
        {#each [...$collections] as [url, coll]}
          <option selected={coll.address == address} value={coll.address}>
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

    <div class="select-wrapper select-storeCollection" on:click={_toggleOpen}>
      <div class="select" class:open>
        {#if $collections?.size > 0}
          <div class="select-trigger">
            <span>
              <Collection {chainId} {address} {account} />
            </span>
          </div>
          <div class="custom-options">
            {#each [...$collections] as [url, coll]}
              <span
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
