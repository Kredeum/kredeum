<script lang="ts">
  import type { NftType } from "@kredeum/common/src/common/types";
  import NftLine from "../Nft/NftLine.svelte";
  import { type Address } from "viem";

  /////////////////////////////////////////////////
  // <NftsLines {chainId} {nfts} {account?} {mode?} />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let owner: Address | undefined = undefined;
  export let mode: string | undefined = undefined;
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
