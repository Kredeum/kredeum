<script lang="ts">
  import { DEFAULT_NAME, DEFAULT_SYMBOL } from "@common/common/config";
  import CollectionData from "./CollectionData.svelte";
  import { Address } from "viem";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: Address;
  export let account: Address | undefined = undefined;
</script>

<CollectionData {chainId} {address} {account} let:collection>
  {#if collection}
    {collection.name || DEFAULT_NAME}
    ({(account && collection.balancesOf?.get(account)) || 0}
    {collection.symbol || DEFAULT_SYMBOL})
  {:else}
    Choose one collection
  {/if}
</CollectionData>
