<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";
  import { getOpenSea } from "@lib/common/config";
  import NftLine from "../Nft/NftLine.svelte";
  import NftsListData from "./NftsListData.svelte";

  /////////////////////////////////////////////////
  //  <NftListLines {chainId} {address} {account} {platform}? />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let platform = undefined;
</script>

<NftsListData {chainId} {address} {account} let:nfts>
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
        <NftLine chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
      {/each}
    {/if}
  </div>
</NftsListData>
