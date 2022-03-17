<script lang="ts">
  export let refreshing: boolean;
  export let nftsList: () => Promise<void>;
</script>

<div class="col col-sm-3">
  <button
    class="clear"
    on:click={() => nftsList()}
    title="      {refreshing ? 'Refreshing NFTs...' : 'Refresh NFTs from this Collection'}"
  >
    <i class="fas fa-redo-alt {refreshing ? 'refresh' : ''}" />
  </button>
</div>
