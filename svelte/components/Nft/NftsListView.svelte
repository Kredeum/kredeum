<script lang="ts">
  import { getNetwork, nftListKey } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";

  export let chainId;
  export let account;
  export let nfts;
  export let platform;
</script>

<div class="table">
  <div class="table-row table-head hidden-xs">
    <div class="table-col"><span class="label">Media</span></div>
    {#if getNetwork(chainId)?.openSea}
      <div class="table-col"><span class="label">Marketplace</span></div>
    {:else}
      <div class="table-col"><span class="label">Infos</span></div>
    {/if}
  </div>
  {#each [...$nfts.values()] as nft, index}
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
  {/each}
</div>
