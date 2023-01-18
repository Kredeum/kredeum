<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";
  import { collectionSubListRefresh, collectionSubListStore } from "@stores/collection/collectionSubList";

  import CollectionSimple from "./CollectionSimple.svelte";

  /////////////////////////////////////////////////
  // <CollectionList {chainId} bind:{address} {account} />
  // Collection List on a network for an account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;
  $: console.log("CollectionSelectSimple chainId CHANGE", chainId);
  $: console.log("CollectionSelectSimple address CHANGE", address);
  $: console.log("CollectionSelectSimple account CHANGE", account);

  let collections: Readable<Map<string, CollectionType>>;

  $: chainId && account && handleChangeCollection();
  const handleChangeCollection = async (): Promise<void> => {
    collections = collectionSubListStore(chainId, account, address);
    await collectionSubListRefresh(chainId, account, address);
  };

  const _setCollectionFromEvent = (evt: Event) => (address = (evt.target as HTMLInputElement).value);
</script>

{#if collections}
  <select on:change={_setCollectionFromEvent}>
    {#each [...$collections] as [key, coll]}
      <option id={key} selected={coll.address == address} value={coll.address}>
        <CollectionSimple chainId={coll.chainId} address={coll.address} {account} />
      </option>
    {/each}
  </select>
{/if}
