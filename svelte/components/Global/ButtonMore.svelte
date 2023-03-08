<script lang="ts">
  /////////////////////////////////////////////////
  // <ButtonMore {refresh} />
  // 1/ Get more NFTs from Collection
  // 2/ Active when refresh
  /////////////////////////////////////////////////
  export let page: number = 1;
  export let refresh: boolean = false;
  /////////////////////////////////////////////////

  const more = () => page++;
</script>

<button class="clear" on:click={more} title="      Click to View more NFTs">
  <i class="fas fa-plus {refresh ? 'refresh' : ''}" />
</button>
