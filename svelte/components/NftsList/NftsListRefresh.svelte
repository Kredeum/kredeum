<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  /////////////////////////////////////////////////
  // <RefreshButton />
  // Display Network
  /////////////////////////////////////////////////

  // Context for refreshCollectionList & refreshCollectionNftsList & refreshing
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshCollectionNftsList: Writable<number> = getContext("refreshCollectionNftsList");
  let refreshing: Writable<boolean> = getContext("refreshing");
  ///////////////////////////////////////////////////////////

  const refreshAll = () => {
    $refreshCollectionList += 1;
    $refreshCollectionNftsList += 1;
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
