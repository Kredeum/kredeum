<script lang="ts">
  import CollectionListDataSimple from "./CollectionListDataSimple.svelte";

  export let chainId: number;
  export let account: string = undefined;
</script>

<CollectionListDataSimple {chainId} {account} let:collections>
  {#if collections}
    {#each [...collections] as [, coll]}
      <p>
        {coll?.name || "No name"} -
        {coll?.address}
      </p>
    {/each}
  {/if}
</CollectionListDataSimple>
