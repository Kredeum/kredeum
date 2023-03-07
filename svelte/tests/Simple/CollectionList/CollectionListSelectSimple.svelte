<script lang="ts">
  import CollectionsDataSimple from "./CollectionListDataSimple.svelte";
  import CollectionSimple from "../Collection/CollectionSimple.svelte";

  export let chainId: number;
  export let address: string = undefined;
  export let account: string = undefined;

  const _setCollectionFromEvent = (evt: Event) => (address = (evt.target as HTMLInputElement).value);
</script>

<CollectionsDataSimple {chainId} {account} let:collections>
  {#if collections}
    <select on:change={_setCollectionFromEvent}>
      {#each [...collections] as [key, coll]}
        <option id={key} selected={coll.address == address} value={coll.address}>
          <CollectionSimple chainId={coll.chainId} address={coll.address} {account} />
        </option>
      {/each}
    </select>
  {/if}
</CollectionsDataSimple>
