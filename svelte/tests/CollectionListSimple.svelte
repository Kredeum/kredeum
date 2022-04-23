<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "lib/ktypes";

  import CollectionSimple from "./CollectionSimple.svelte";
  import { collectionDefaultStore } from "stores/collection/collectionDefault";
  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <CollectionListSimple chainId} bind:{address} {account} {mintable} {refreshing} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  export let mintable: boolean = false;
  export let refreshing: boolean = undefined;

  let collections: Readable<Map<string, CollectionType>>;
  let i = 1;
  let j = 1;

  // ACTION : refresh Collections async
  $: if (chainId && account) _refresh(chainId, account, mintable);
  const _refresh = async (_chainId: number, _account: string, _mintable: boolean): Promise<void> => {
    refreshing = true;
    await collectionStore.refreshList(_chainId, _account, _mintable);
    refreshing = false;
    console.log(
      `REFRESH COLLECTION LIST ${i++} collection://${_chainId}${_account ? "@" + _account : ""} ${String(_mintable)}`
    );
  };

  // STATE VIEW : get Collections sync
  $: if (chainId && account) _get(chainId, account, mintable);
  const _get = (_chainId: number, _account: string, _mintable: boolean): void => {
    collections = collectionStore.getSubListStore(_chainId, _account, _mintable);
    console.log(
      `GET COLLECTION LIST ${j++} collection://${_chainId}${_account ? "@" + _account : ""} ${String(_mintable)}\n`,
      $collections
    );
  };

  // ACTION : refresh default Collections sync
  $: collectionStore.refreshDefault(chainId, account);

  // STATE VIEW : Collections
  $: collectionDefault = collectionStore.getDefaultSubStore(chainId, mintable, account);
  $: address = $collectionDefault;

  const _setCollection = (_collection: string): string => {
    if (!(chainId && _collection)) return;

    console.log("_setCollection", chainId, _collection);
    address = _collection;
    collectionStore.setDefaultOne(chainId, _collection, mintable, account);

    return address;
  };
</script>

{#if address}
  <CollectionSimple {chainId} {address} {account} />
{/if}

{#if collections}
  {#each [...$collections] as [url, coll]}
    <p on:click={() => _setCollection(coll.address)}>
      {coll?.name}
      {coll?.address}
    </p>
  {/each}
{/if}
