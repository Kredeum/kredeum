<script lang="ts">
  import type { NftType } from "@lib/common/ktypes";

  import { nftName } from "@lib/common/kconfig";

  import MediaDisplay from "../Media/MediaDisplay.svelte";

  /////////////////////////////////////////////////
  //  <NftGrid {nft} {account}  />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let nft: NftType;

  let displayMode: string = "grid";

  // $: console.log("NftGrid", nft);
  ///////////////////////////////////////////////////////////////////////////////
</script>

<div class="col col-xs-12 col-sm-4 col-md-3 col-lg-2">
  <div class="grid-card-krd" data-tokenid={nft?.tokenID || ""}>
    <MediaDisplay {nft} {displayMode} />

    <div class="caption">
      <h3>{nftName(nft)}</h3>
    </div>
  </div>
</div>

<style>
  .grid-card-krd h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 20.8px;
  }
</style>
