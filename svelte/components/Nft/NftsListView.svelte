<script lang="ts">
  // import type { NftType } from "lib/ktypes";

  import { getNetwork } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";

  /////////////////////////////////////////////////
  //  <NftListView {chainId} {account} {nfts} {platform}? />
  // Display NFTs List
  /////////////////////////////////////////////////

  export let chainId: number;
  export let account: string;
  export let nfts;
  export let platform = "dapp";
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
