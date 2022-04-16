<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType } from "lib/ktypes";
  import { collectionKey } from "lib/kconfig";

  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let collection: Readable<CollectionType>;
  let i = 1;

  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && handleChange();
  const handleChange = async (): Promise<void> => {
    console.log(`COLLECTION CHANGE #${i++} ${collectionKey(chainId, address, account)}`);

    // STATE VIEW : get Collection on chainId or address change
    collection = collectionStore.getStore(chainId, address);

    // ACTION : refresh Collection on chainId, address or account change
    collectionStore.refresh(chainId, address, account).catch(console.error);
  };
</script>

{#if $collection}
  {$collection.name || "No name"}
  ({$collection.balancesOf?.get(account) || 0}
  {$collection.symbol || "NFT"})
{:else}
  Choose one collection
{/if}
