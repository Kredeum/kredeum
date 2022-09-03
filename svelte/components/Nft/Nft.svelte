<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "@lib/common/ktypes";
  import {
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getOpenSea,
    nftOpenSeaUrl,
    addressSame
  } from "@lib/common/kconfig";

  import MediaPreview from "../Media/MediaPreview.svelte";

  import { shortcode } from "@helpers/shortcodes";
  import { nftStore } from "@stores/nft/nft";

  import NftTransfer from "./NftTransfer.svelte";
  import NftBuy from "./NftBuy.svelte";
  import NftBurn from "./NftBurn.svelte";
  import NftSell from "./NftSell.svelte";

  import { getEthersConverterLink } from "@lib/nft/kautomarket";

  // import NftClaim from "./NftClaim.svelte";

  import { metamaskChainId } from "@main/metamask";
  import { constants, ethers } from "ethers";
  // import { collectionGetContract } from "@lib/collection/kcollection-get";
  // import { formatEther } from "ethers/lib/utils";

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
  $: account, chainId && address && tokenID && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: console.info("Nft", $nft);
</script>

{#if $nft}
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        <MediaPreview nft={$nft} />
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
            <div class="flex overflow-ellipsis" title="Token ID #{tokenID}">
              <strong> <a href={kredeumNftUrl(chainId, $nft)}>#{tokenID}</a></strong>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Owner</span></div>
            <div class="flex">{@html explorerAddressLink(chainId, $nft.owner, 15)}</div>
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
              {#if $nft.tokenURI}
                <a class="link overflow-ellipsis" href={$nft.tokenURI} title={$nft.ipfsJson} target="_blank"
                  >{$nft.tokenURI}</a
                >
              {:else}
                NO metadata
              {/if}
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Image</span></div>
            <div class="flex">
              <a class="link overflow-ellipsis" href={$nft.image} title={$nft.ipfs} target="_blank">
                {$nft.image || ""}
              </a>
            </div>
          </li>
          {#if $nft.price || $nft.price === "0"}
            <li>
              <div class="flex"><span class="label">Nft Price</span></div>
              <div class="flex">
                <a
                  class="link overflow-ellipsis"
                  href={getEthersConverterLink(chainId, $nft.price)}
                  title={ethers.utils.formatEther($nft.price)}
                  target="_blank"
                >
                  {ethers.utils.formatEther($nft.price)} Eth
                </a>
              </div>
            </li>
          {/if}
          {#if $nft.royaltyAmount}
            <li>
              <div class="flex"><span class="label">Nft Royalties Amount</span></div>
              <div class="flex">
                {#if $nft.royaltyAmount === "0"}
                  <span class="overflow-ellipsis" title={$nft.royaltyAmount}
                    >{$nft.price === "0.0" ? "Set price to calculate royalties" : "No royalties amount setted"}</span
                  >
                {:else}
                  <a
                    href={getEthersConverterLink(chainId, $nft.price)}
                    class="link overflow-ellipsis"
                    title={$nft.royaltyAmount}
                    target="_blank"
                  >
                    {$nft.royaltyAmount} Eth
                  </a>
                {/if}
              </div>
            </li>
          {/if}
          {#if $nft.royaltyReceiver}
            <li>
              <div class="flex"><span class="label">Nft Royalties receiver</span></div>
              <div class="flex">
                <span class="overflow-ellipsis" title="Receiver of the royalties" target="_blank">
                  {$nft.royaltyReceiver === constants.AddressZero
                    ? "No receiver setted for Royalties"
                    : $nft.royaltyReceiver}
                </span>
              </div>
            </li>
          {/if}
        </ul>

        <div class="p-t-40 p-b-40 grid-buttons">
          {#if "wordpress" === platform}
            <a href="#schortcodes" class="btn btn-small btn-outline" title="Get shortcode"
              ><i class="fa fa-code" /><span>Get shortcode</span></a
            >
          {/if}
          {#if $nft.owner === account}
            <a
              href="#transfert-nft-{tokenID}"
              class="btn btn-small btn-outline {$nft.price && $nft.price !== '0' ? 'kre-disabled' : ''}"
              title="Make a gift"
              aria-disabled={$nft.price && $nft.price !== "0"}><i class="fa fa-gift" /> Transfer</a
            >
          {/if}
          {#if $nft.owner === account}
            <NftSell {chainId} {address} {tokenID} nftPrice={$nft.price} />
          {/if}
          {#if $nft.owner !== account}
            <NftBuy {chainId} {address} {tokenID} nftPrice={$nft?.price} />
          {/if}
          {#if $nft.burnable && $nft.owner === account}
            <a href="#burn-nft-{tokenID}" class="btn btn-small btn-outline btn-burn" title="Burn Nft"
              ><i class="fa fa-fire" /> Burn</a
            >
          {/if}

          <!-- <a href="#claim-nft-{tokenID}" class="btn btn-small btn-default" title="Claim NFT on antoher network">
            <i class="fas fa-exclamation" /> Claim</a
          > -->

          {#if getOpenSea(chainId)}
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

<!-- Modal burn nft -->
<div id="burn-nft-{tokenID}" class="modal-window">
  <NftBurn {chainId} {address} {tokenID} />
</div>

<!-- Modal claim nft -->

<!-- <div id="claim-nft-{tokenID}" class="modal-window">
  <NftClaim {chainId} {address} {tokenID} />
</div> -->
<style>
  .krd-nft-solo {
    width: 100%;
  }

  .btn-burn {
    color: red;
    border-color: red;
    float: right;
  }

  .btn-burn:hover {
    color: white;
    background: red;
  }

  a.kre-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
