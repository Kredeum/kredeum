<script lang="ts">
  import { nftName } from "@lib/common/config";
  import { nftStore } from "@stores/nft/nft";
  import MediaDisplay from "../Media/MediaDisplay.svelte";

  /////////////////////////////////////////////////
  // <NftGrid {chainId} {address} {tokenID} />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  ///////////////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////
</script>

{#if $nft}
  <div class="grid-card-krd" data-tokenid={tokenID || ""}>
    <MediaDisplay {chainId} {address} {tokenID} displayMode="grid" />
    <div class="caption">
      <h3>{nftName($nft)}</h3>
    </div>
  </div>
{/if}

<style>
  .grid-card-krd h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 20.8px;
  }
</style>
