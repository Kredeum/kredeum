<script lang="ts">
  import { NftType } from "@lib/common/types";
  import NftLine from "../Nft/NftLine.svelte";

  /////////////////////////////////////////////////
  // <NftsLines {chainId} {nfts} {account?} {mode?} />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let owner: string = undefined;
  export let mode: string = undefined;
</script>

<div class="table">
  <div class="table-row table-head hidden-xs">
    <div class="table-col"><span class="label">Media</span></div>
    <div class="table-col"><span class="label">TokenID</span></div>
  </div>
  {#if nfts?.size > 0}
    {#each [...nfts.values()] as nft}
      <NftLine chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {owner} {mode} />
    {/each}
  {/if}
</div>
