<script lang="ts">
  import type { Collection } from "lib/ktypes";

  /////////////////////////////////////////////////
  // <Collection {collectionObject} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let collectionObject: Collection;
  // export let account: string = undefined;
</script>

{collectionObject?.name || "No name"}
({collectionObject?.balanceOf || 0}
{collectionObject?.symbol || "NFT"})
