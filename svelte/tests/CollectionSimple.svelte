<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";

  // import { collectionStore } from "@stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let collection: Readable<CollectionType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && handleChange();
  const handleChange = (): void => {
    // console.log(`COLLECTION CHANGE #${i++} ${keyCollection(chainId, address, account)}`);
    // STATE VIEW : sync get Collection
    // collection = collectionStore.getOneStore(chainId, address);
    // ACTION : async refresh Collection
    // collectionStore.refreshOne(chainId, address, account).catch(console.error);
  };
</script>

<div>
  <strong>
    {#if $collection}
      {$collection.name || "No name"} -
      {$collection.address}
    {:else}
      Choose one collection
    {/if}
  </strong>
</div>
<hr />
