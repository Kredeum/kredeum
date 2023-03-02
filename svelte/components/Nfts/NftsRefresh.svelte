<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext } from "svelte";

  /////////////////////////////////////////////////
  // <RefreshButton />
  // Display Network
  /////////////////////////////////////////////////

  // Context for refreshCollections & refreshNfts & refreshing
  ///////////////////////////////////////////////////////////
  let refreshCollections: Writable<number> = getContext("refreshCollections");
  let refreshNfts: Writable<number> = getContext("refreshNfts");
  let refreshing: Writable<boolean> = getContext("refreshing");
  ///////////////////////////////////////////////////////////

  const refreshAll = () => {
    $refreshCollections += 1;
    $refreshNfts += 1;
  };
</script>

<div class="col col-sm-3">
  <button
    class="clear"
    on:click={refreshAll}
    title="      {$refreshing ? 'Refreshing NFTs...' : 'Refresh NFTs from this Collection'}"
  >
    <i class="fas fa-redo-alt {$refreshing ? 'refresh' : ''}" />
  </button>
</div>
