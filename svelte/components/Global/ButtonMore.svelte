<script lang="ts">
  /////////////////////////////////////////////////
  // <ButtonMore {refresh} />
  // 1/ Get more NFTs from Collection
  // 2/ Active when refresh
  /////////////////////////////////////////////////
  export let more: () => number;
  /////////////////////////////////////////////////
</script>

<button class="clear" on:click={more} title="      Click to View more NFTs">
  <i class="fas fa-plus" />
</button>
