<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";
  import { collectionStore } from "@stores/collection/collection";
  import CollectionSimple from "./CollectionSimple.svelte";

  /////////////////////////////////////////////////
  // <CollectionList chainId} bind:{address} {account} {mintable} {label} {txt} {refreshing} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  export let mintable: boolean = false;
  export let refreshing: boolean = undefined;

  let collections: Readable<Map<string, CollectionType>>;
  // let collectionDefault: Readable<string>;

  // let i: number = 0;
  // HANDLE CHANGE : on truthy chainId and account, and whatever mintable
  $: mintable, chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    // console.log(`COLLECTION LIST CHANGE #${i++} ${collectionListKey(chainId, account, mintable)}`);

    // STATE VIEW : sync get Collections
    collections = collectionStore.getSubListStore(chainId, account, mintable);

    // STATE VIEW : sync get default Collection
    // collectionDefault = collectionStore.getDefaultSubStore(chainId, mintable, account);

    // ACTION : async refresh Collections
    refreshing = true;
    await collectionStore.refreshSubList(chainId, account, mintable);
    refreshing = false;
    console.info("COLLECTIONS", $collections);

    // ACTION : sync refresh default Collections
    collectionStore.refreshDefault(chainId, account);
  };

  // STATE CHANGER : SET default Collection
  const _setCollection = (collection: string): void => {
    address = collection;
    collectionStore.setDefaultOne(chainId, collection, mintable, account);
  };
</script>

{#if address}
  <CollectionSimple {chainId} {address} {account} />
{/if}

{#if collections}
  {#each [...$collections] as [key, coll]}
    <p id={key} on:click={() => _setCollection(coll.address)} on:keydown={() => _setCollection(coll.address)}>
      {coll?.name || "No name"} -
      {coll?.address}
    </p>
  {/each}
{/if}
