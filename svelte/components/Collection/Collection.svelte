<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType } from "lib/ktypes";
  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  // // ACTION : refresh Collection
  // $: collectionStore.refresh(chainId, address, account).catch(console.error);

  // // STATE VIEW : get Collection
  // $: collection = collectionStore.getStore(chainId, address);

  let collection: Readable<CollectionType>;
  let i = 1;
  let j = 1;

  // ACTION : refresh Collection on chainId, address or account change
  $: if (chainId && address) _refresh(chainId, address, account);
  const _refresh = (_chainId: number, _address: string, _account: string): void => {
    collectionStore.refresh(_chainId, _address, _account).catch(console.error);
    console.log(`REFRESH COLLECTION ${i++} collection://${_chainId}/${_address}${_account ? "@" + _account : ""}`);
  };

  // STATE VIEW : get Collection on chainId or address change
  $: if (chainId && address) _get(chainId, address);
  const _get = (_chainId: number, _address: string): void => {
    collection = collectionStore.getStore(_chainId, _address);
    console.log(
      `CURRENT COLLECTION ${j++} collection://${_chainId}/${_address}\n`,
      $collection || { chainId: _chainId, address: _address }
    );
  };
</script>

{#if $collection}
  {$collection.name || "No name"}
  ({$collection.balancesOf?.get(account) || 0}
  {$collection.symbol || "NFT"})
{:else}
  Choose one collection
{/if}
