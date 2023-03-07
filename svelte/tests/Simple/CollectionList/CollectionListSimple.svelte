<script lang="ts">
  import CollectionsDataSimple from "./CollectionListDataSimple.svelte";

  export let chainId: number;
  export let account: string = undefined;
</script>

<CollectionsDataSimple {chainId} {account} let:collections>
  {#if collections}
    {#each [...collections.values()] as coll}
      <p>
        {coll?.name || "No name"} -
        {coll?.address}
      </p>
    {/each}
  {/if}
</CollectionsDataSimple>
