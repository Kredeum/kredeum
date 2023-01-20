<script lang="ts">
  import { nftName } from "@lib/common/config";
  import MediaDisplay from "../Media/MediaDisplay.svelte";
  import NftData from "./NftData.svelte";

  /////////////////////////////////////////////////
  // <NftGrid {chainId} {address} {tokenID} />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
</script>

<NftData {chainId} {address} {tokenID} let:nft>
  {#if nft}
    <div class="grid-card-krd" data-tokenid={nft.tokenID || ""}>
      <MediaDisplay {nft} displayMode="grid" />

      <div class="caption">
        <h3>{nftName(nft)}</h3>
      </div>
    </div>
  {/if}
</NftData>

<style>
  .grid-card-krd h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 20.8px;
  }
</style>
