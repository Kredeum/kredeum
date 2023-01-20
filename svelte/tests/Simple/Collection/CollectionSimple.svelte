<script lang="ts">
  import CollectionDataSimple from "./CollectionDataSimple.svelte";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
</script>

<CollectionDataSimple {chainId} {address} {account} let:collection>
  <div>
    <strong>
      {#if collection}
        {collection.balancesOf?.get(account) || "?"}
        {collection.name || "No name"} -
        {collection.address}
      {:else}
        Choose one collection
      {/if}
    </strong>
  </div>
  <hr />
</CollectionDataSimple>
