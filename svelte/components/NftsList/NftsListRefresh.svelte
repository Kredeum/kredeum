<script lang="ts">
  /////////////////////////////////////////////////
  // <RefreshButton {refreshing} {nftsList} />
  // Display Network
  /////////////////////////////////////////////////
  export let refreshing: boolean = true;
  export let refresh: number = 0;
</script>

<div class="col col-sm-3">
  <button
    class="clear"
    on:click={() => (refresh += 1)}
    title="      {refreshing ? 'Refreshing NFTs...' : 'Refresh NFTs from this Collection'}"
  >
    <i class="fas fa-redo-alt {refreshing ? 'refresh' : ''}" />
  </button>
</div>
