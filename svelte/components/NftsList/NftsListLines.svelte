<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/ktypes";

  import { getOpenSea } from "@lib/common/kconfig";

  import NftLine from "../Nft/NftLine.svelte";

  /////////////////////////////////////////////////
  //  <NftListLines {chainId} {account} {nfts} {platform}? />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let account: string;
  export let nfts: Readable<Map<string, NftType>>;
  export let platform = undefined;
</script>

<div class="table">
  <div class="table-row table-head hidden-xs">
    <div class="table-col"><span class="label">Media</span></div>
    {#if getOpenSea(chainId)}
      <div class="table-col"><span class="label">Marketplace</span></div>
    {:else}
      <div class="table-col"><span class="label">Infos</span></div>
    {/if}
  </div>
  {#each [...$nfts.values()] as nft}
    <NftLine {nft} {account} {platform} />
  {/each}
</div>
