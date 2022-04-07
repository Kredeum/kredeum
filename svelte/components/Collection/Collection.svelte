<script lang="ts">
  import { collectionGet } from "stores/collectionGet";

  /////////////////////////////////////////////////
  // <Collection {chainId} {collection} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account = "";

  $: collectionObject = collectionGet(chainId, collection, account);
</script>

{#if $collectionObject}
  {$collectionObject.name || "No name"}
  ({$collectionObject.balanceOf || 0}
  {$collectionObject.symbol || "NFT"})
{:else}
  Loading collection details...
{/if}
