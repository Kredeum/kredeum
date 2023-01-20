<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType } from "@lib/common/types";
  import { collectionSubListRefresh, collectionSubListStore } from "@stores/collection/collectionSubList";

  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;

  let collections: Readable<Map<string, CollectionType>>;

  $: chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    collections = collectionSubListStore(chainId, account, address);
    await collectionSubListRefresh(chainId, account, address);
  };
  $: console.log("collections", $collections);
</script>

<slot collections={$collections}>
  <p>
    LOADING COLLECTIONS LIST...
  </p>
</slot>