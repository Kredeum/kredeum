<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";
  import { DEFAULT_NAME, DEFAULT_SYMBOL } from "@lib/common/config";

  import { collectionStore } from "@stores/collection/collection";
  import CollectionData from "./CollectionData.svelte";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
</script>

<CollectionData {chainId} {address} {account} let:collection>
  {#if collection}
    {collection.name || DEFAULT_NAME}
    ({collection.balancesOf?.get(account) || 0}
    {collection.symbol || DEFAULT_SYMBOL})
  {:else}
    Choose one collection
  {/if}
</CollectionData>
