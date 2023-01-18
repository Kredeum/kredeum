<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";
  import { collectionSubListRefresh, collectionSubListStore } from "@stores/collection/collectionSubList";

  /////////////////////////////////////////////////
  // <CollectionList {chainId} bind:{address} {account} />
  // Collection List on a network for an account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  $: console.log("CollectionListSimple chainId CHANGE", chainId);
  $: console.log("CollectionListSimple account CHANGE", account);

  let collections: Readable<Map<string, CollectionType>>;

  $: chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    collections = collectionSubListStore(chainId, account, address);
    await collectionSubListRefresh(chainId, account, address);
  };
</script>

{#if collections}
  {#each [...$collections] as [key, coll]}
    <p>
      {coll?.name || "No name"} -
      {coll?.address}
    </p>
  {/each}
{/if}
