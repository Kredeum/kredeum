<script lang="ts">
  import CollectionsDataSimple from "./CollectionsDataSimple.svelte";

  export let chainId: number;
  export let account: string = undefined;
</script>

<CollectionsDataSimple {chainId} {account} let:collections>
  {#if collections}
    {#each [...collections] as [ coll]}
      <p>
        {coll?.name || "No name"} -
        {coll?.address}
      </p>
    {/each}
  {/if}
</CollectionsDataSimple>
