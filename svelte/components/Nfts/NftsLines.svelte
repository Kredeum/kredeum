<script lang="ts">
  import { getOpenSea } from "@lib/common/config";
  import { NftType } from "@lib/common/types";
  import NftLine from "../Nft/NftLine.svelte";

  /////////////////////////////////////////////////
  // <NftsLines {chainId} {nfts} {account?} {platform?} />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let nfts: Map<string, NftType>;
  export let owner: string = undefined;
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
  {#if nfts?.size > 0}
    {#each [...nfts.values()] as nft}
      <NftLine chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {owner} {platform} />
    {/each}
  {/if}
</div>
