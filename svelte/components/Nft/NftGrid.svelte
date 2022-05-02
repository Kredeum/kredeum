<script lang="ts">
  import type { NftType } from "lib/ktypes";

  import { displayedTokenID } from "main/diplayedNft";

  import { nftName, nftOpenSeaUrl, addressSame, getNetwork } from "lib/kconfig";
  import { divMedia } from "helpers/mediasDisplay";

  /////////////////////////////////////////////////
  //  <NftGrid {nft} {account} {index} {platform}? />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let account: string = undefined;

  export let index: number;

  // export let platform: string = "dapp";

  ///////////////////////////////////////////////////////////////////////////////
  const displayNftSolo = (evt: Event, clickedNftTokenID: string) => {
    if (!(evt.target as HTMLInputElement).classList.contains("btn")) {
      evt.preventDefault();
      displayedTokenID.set(clickedNftTokenID);
    }
  };

  console.log("nft", nft);
  ///////////////////////////////////////////////////////////////////////////////
</script>

<div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
  <div class="grid-card-krd" on:click={(evt) => displayNftSolo(evt, nft.tokenID)}>
    {@html divMedia(nft, index, true)}

    <div class="caption">
      <h3>{nftName(nft)}</h3>
      {#if getNetwork(nft.chainId)?.openSea}
        {#if addressSame(nft.owner, account)}
          <a href={nftOpenSeaUrl(nft.chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
            Sell
          </a>
        {:else}
          <a href={nftOpenSeaUrl(nft.chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
        {/if}
      {/if}
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
