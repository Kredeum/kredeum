<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftOpenSeaUrl,
    addressSame
  } from "lib/kconfig";
  import MediaPreview from "../Media/MediaPreview.svelte";

  import { shortcode } from "helpers/shortcodes";

  import { nftStore } from "stores/nft/nft";

  import NftTransfer from "./NftTransfer.svelte";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} {account}? {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let platform: string = undefined;

  let nft: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: console.log("Nft", $nft);
</script>

{#if $nft}
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        <MediaPreview nft={$nft} index={Number(tokenID)} />
      </div>
    </div>

    <div class="col col-xs-12 col-sm-8 col-md-9">
      <div class="card-krd">
        <h3>{$nft.name}</h3>
        <p>
          {$nft.description}
        </p>

        <ul class="steps">
          <li>
            <div class="flex"><span class="label"><strong>Token ID</strong></span></div>
            <div class="flex"><strong>#{tokenID}</strong></div>
          </li>
          <li>
            <div class="flex"><span class="label">Owner</span></div>
            <div class="flex">{@html explorerAddressLink(chainId, $nft.owner, 15)}</div>
          </li>
          <li>
            <div class="flex"><span class="label">Permanent link</span></div>
            <div class="flex">
              <a
                class="link overflow-ellipsis"
                href={kredeumNftUrl(chainId, $nft)}
                title={nftUrl($nft, 10)}
                target="_blank"
              >
                {@html nftUrl($nft, 10)}
              </a>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">collection @</span></div>
            <div class="flex">
              <a
                class="link overflow-ellipsis"
                href={explorerCollectionUrl(chainId, address)}
                title={address}
                target="_blank"
              >
                {address}
              </a>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Metadata</span></div>
            <div class="flex">
              <a class="link overflow-ellipsis" href={$nft.tokenURI} title={$nft.ipfsJson} target="_blank"
                >{$nft.ipfsJson}</a
              >
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Image</span></div>
            <div class="flex">
              <a class="link overflow-ellipsis" href={$nft.image} title={$nft.ipfs} target="_blank">
                {$nft.ipfs}
              </a>
            </div>
          </li>
        </ul>

        <div class="p-t-40 p-b-40 grid-buttons">
          {#if "wordpress" === platform}
            <a href="#schortcodes" class="btn btn-small btn-outline" title="Get shortcode"
              ><i class="fa fa-code" /><span>Get shortcode</span></a
            >
          {/if}
          <a href="#transfert-nft-{tokenID}" class="btn btn-small btn-outline" title="Make a gift"
            ><i class="fa fa-gift" /> Transfer</a
          >

          {#if getNetwork(chainId)?.openSea}
            {#if addressSame($nft.owner, account)}
              <a href={nftOpenSeaUrl(chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
                Sell
              </a>
            {:else}
              <a href={nftOpenSeaUrl(chainId, $nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Modal Shortcodes -->
<div id="schortcodes" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-code fa-left c-green" />
          Shortcodes
        </div>
        <p>Click on the Copy Button to copy the shortcode in your clipboard and then paste it in a WordPress page.</p>

        <ul class="steps">
          <li>
            <div class="flex"><span class="label">Sell direclty on Opensea</span></div>
            <div class="flex">
              <a on:click|preventDefault={() => shortcode($nft)} class="btn btn-small btn-outline" href="." title="Copy"
                >Copy</a
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Modal transfer nft -->
<div id="transfert-nft-{tokenID}" class="modal-window">
  <NftTransfer {chainId} {address} {tokenID} />
</div>

<!-- <div id="claim-$nft-{$nft.tokenID}" class="modal-window">
  <NftClaimView bind:$nft />
</div> -->
<style>
  .krd-nft-solo {
    width: 100%;
  }
</style>
