<script lang="ts">
  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account = "";

  // ACTION : refresh Collection
  $: collectionStore.refresh(chainId, address, account).catch(console.error);

  // STATE VIEW : get Collection
  $: collection = collectionStore.get(chainId, address);
</script>

{#if $collection}
  {$collection.name || "No name"}
  ({$collection.balancesOf?.get(account) || 0}
  {$collection.symbol || "NFT"})
{:else}
  Choose one collection
{/if}
