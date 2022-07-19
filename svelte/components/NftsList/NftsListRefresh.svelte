<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  /////////////////////////////////////////////////
  // <RefreshButton />
  // Display Network
  /////////////////////////////////////////////////

  // Context for refreshCollection & refreshNfts & refreshing
  ///////////////////////////////////////////////////////////
  let refreshCollection: Writable<number> = getContext("refreshCollection");
  let refreshNfts: Writable<number> = getContext("refreshNfts");
  let refreshing: Writable<boolean> = getContext("refreshing");
  ///////////////////////////////////////////////////////////

  const refreshAll = () => {
    $refreshCollection += 1;
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
