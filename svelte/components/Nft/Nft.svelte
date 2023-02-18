<script lang="ts">
  import { constants, ethers, utils } from "ethers";

  import {
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getCurrency,
    kredeumNftHttp
  } from "@lib/common/config";

  import MediaPreview from "../Media/MediaPreview.svelte";
  import NftExchange from "./NftExchange.svelte";

  import { getShortcodeBuyCode, shortcodeBuy } from "@helpers/shortcodes";
  import {
    nftOwner,
    nftMarketable,
    nftRoyaltyAccount,
    nftRoyalty,
    nftRoyaltyFee,
    nftPrice,
    nftMinPrice
  } from "@helpers/nft";

  import NftTransfer from "./NftTransfer.svelte";
  import NftBurn from "./NftBurn.svelte";
  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} {account}? {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////
  $: nft = nftStore.getOneAndRefresh(chainId, address, tokenID);
  /////////////////////////////////////////////////////////////
</script>

{#if $nft}
  <div class="{platform === 'wordpress' ? '' : 'row'} krd-nft-solo">
    <div class={platform === "wordpress" ? "kre-wordpress-card" : "col col-xs-12 col-sm-4 col-md-3"}>
      <div class="card-krd kre-media">
        <MediaPreview {chainId} {address} {tokenID} />
      </div>
      <div class="kre-action-buttons {platform === 'wordpress' ? 'kre-wordpress-buttons' : ''}">
        {#if nftOwner($nft) === account && platform !== "wordpress"}
          <a href="#schortcodes" title="Get shortcode" class="btn-shortcod-modal"
            ><i class="fas fa-code fa-left c-green" /> GET SHORTCODE</a
          >

          <a href="#transfert-nft-{tokenID}" class="btn-transfer-modal" title="Make a gift"
            ><i class="fa fa-gift fa-left" /> TRANSFER</a
          >

          <a href="#burn-nft-{tokenID}" title="Burn Nft" class="btn-burn-modal"><i class="fa fa-fire fa-left" /> BURN</a
          >
        {/if}

        {#if platform === "wordpress"}
          <div class="kre-buy-infos">
            <div class="overflow-ellipsis kre-buy-link">
              <strong>
                <a href={kredeumNftHttp(chainId, $nft)} target="_blank" rel="noreferrer" class="kre-blue-link"
                  >{$nft.name} #{tokenID}</a
                >
              </strong>
            </div>
            <div class="overflow-ellipsis kre-buy-price">
              <strong>{utils.formatEther(nftPrice($nft))} {getCurrency(chainId)}</strong>
            </div>
          </div>
        {/if}

        <NftExchange {chainId} {address} {tokenID} {platform} />
      </div>
    </div>

    {#if platform !== "wordpress"}
      <div class="col col-xs-12 col-sm-8 col-md-9">
        <div class="card-krd">
          <h3>{$nft.name}</h3>
          <p>
            {$nft.description}
          </p>

          <ul class="steps">
            <li>
              <div class="flex"><span class="label"><strong>Token ID</strong></span></div>
              <div class="flex kre-flex-align-center" title="Token ID #{tokenID}">
                <div class="overflow-ellipsis">
                  <strong> <a href={kredeumNftUrl(chainId, $nft)} class="kre-blue-link">#{tokenID}</a></strong>
                </div>
                <CopyRefItem copyData={tokenID} />
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">Owner</span></div>
              <div class="flex kre-flex-align-center">
                <div class="overflow-ellipsis">
                  {@html explorerAddressLink(chainId, nftOwner($nft), 15)}
                </div>
                <CopyRefItem copyData={nftOwner($nft)} />
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">collection @</span></div>
              <div class="flex kre-flex-align-center">
                <div class="overflow-ellipsis">
                  <a
                    class="link"
                    href={explorerCollectionUrl(chainId, address)}
                    title={address}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {address}
                  </a>
                </div>
                <CopyRefItem copyData={address} />
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">Metadata</span></div>
              <div class="flex kre-flex-align-center">
                {#if $nft.tokenURI}
                  <div class="overflow-ellipsis">
                    <a
                      class="link overflow-ellipsis"
                      href={$nft.tokenURI}
                      title={$nft.ipfsJson}
                      target="_blank"
                      rel="noreferrer">{$nft.tokenURI}</a
                    >
                  </div>
                  <CopyRefItem copyData={$nft.tokenURI} />
                {:else}
                  NO metadata
                {/if}
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">Image</span></div>
              <div class="flex kre-flex-align-center">
                <div class="overflow-ellipsis">
                  <a class="link" href={$nft.image} title={$nft.ipfs} target="_blank" rel="noreferrer">
                    {$nft.image || ""}
                  </a>
                </div>
                <CopyRefItem copyData={$nft.image || ""} />
              </div>
            </li>
            {#if $nft.animation_url}
              <li>
                <div class="flex"><span class="label">Media</span></div>
                <div class="flex kre-flex-align-center">
                  <div class="overflow-ellipsis">
                    <a class="link" href={$nft.animation_url} title={$nft.ipfs} target="_blank" rel="noreferrer">
                      {$nft.animation_url || ""}
                    </a>
                  </div>
                  <CopyRefItem copyData={$nft.animation_url || ""} />
                </div>
              </li>
            {/if}
            {#if nftMarketable}
              {#if nftPrice($nft).gt(0)}
                <li>
                  <div class="flex"><span class="label">Nft Price</span></div>
                  <div class="flex kre-flex-align-center">
                    <div class="overflow-ellipsis">
                      <span
                        class={nftPrice($nft).lt(nftMinPrice($nft)) ? "c-red" : ""}
                        title={ethers.utils.formatEther(nftPrice($nft))}
                      >
                        {utils.formatEther(nftPrice($nft))}
                        {getCurrency(chainId)}
                      </span>
                    </div>
                    <CopyRefItem copyData={utils.formatEther(nftPrice($nft))} />
                  </div>
                </li>
              {/if}
              {#if nftRoyalty($nft)}
                <li>
                  <div class="flex"><span class="label">Nft Royalties Amount</span></div>
                  <div class="flex kre-flex-align-center">
                    <div class="overflow-ellipsis">
                      {#if nftRoyaltyFee($nft) > 0}
                        <span class="link" title={`${nftRoyaltyFee($nft) / 100} %`}>
                          {nftRoyaltyFee($nft) / 100} %
                        </span>
                      {:else}
                        <span title="no royalties">No royalties amount setted</span>
                      {/if}
                    </div>
                    <CopyRefItem copyData={String(nftRoyaltyFee($nft) / 100)} />
                  </div>
                </li>

                <li>
                  <div class="flex"><span class="label">Nft Royalty receiver</span></div>
                  <div class="flex kre-flex-align-center">
                    <div class="overflow-ellipsis">
                      <span class="overflow-ellipsis" title="Receiver of the royalties">
                        {#if nftRoyaltyAccount($nft) === constants.AddressZero}
                          "No receiver setted for Royalties"
                        {:else}
                          {@html explorerAddressLink(chainId, nftRoyaltyAccount($nft), 15)}
                        {/if}
                      </span>
                    </div>
                    <CopyRefItem copyData={nftRoyaltyAccount($nft)} />
                  </div>
                </li>
              {/if}
            {/if}
          </ul>
        </div>
      </div>
    {/if}
  </div>

  <!-- Modal Shortcodes -->
  <div id="schortcodes" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-code fa-left c-green" />
            WordPress Shortcode
          </div>
          <p>Click on the COPY button to copy in your clipboard the shortcode to paste it in a WordPress page.</p>
          <!-- <p>
              Click on the COPY button to copy in your clipboard the snippet and paste it in any html page or the
              shortcodes to paste them in a WordPress page.
            </p> -->

          <ul class="steps">
            {#if nftMarketable}
              <!-- <li>
                  <div class="flex">
                    <span class="label">SELL on your website with this buy snippet</span>
                  </div>
                  <div class="flex kre-buy-widget-textarea">
                    <textarea value={getAutoMarketWidgetCode($nft)} />
                    <a
                      on:click|preventDefault={() => autoMarketWidget($nft)}
                      class="btn btn-small btn-outline"
                      href="."
                      title="Copy">Copy</a
                    >
                  </div>
                </li> -->
              <li>
                <div class="flex"><span class="label">SELL on your WordPress site with this shortcode</span></div>
                <div class="flex kre-buy-widget-textarea">
                  <textarea value={getShortcodeBuyCode($nft)} />
                  <a
                    on:click|preventDefault={() => shortcodeBuy($nft)}
                    class="btn btn-small btn-outline"
                    href="."
                    title="Copy">Copy</a
                  >
                </div>
              </li>
            {/if}
            <!-- {#if getNetwork($metamaskChainId)?.openSea}
                <li>
                  <div class="flex">
                    <span class="label">View on OpenSea from your wordpress site with this shortcode</span>
                  </div>
                  <div class="flex kre-buy-widget-textarea">
                    <textarea value={getShortcodeOpenSeaCode($nft)} />
                    <a
                      on:click|preventDefault={() => shortcode($nft)}
                      class="btn btn-small btn-outline"
                      href="."
                      title="Copy">Copy</a
                    >
                  </div>
                </li>
              {/if} -->
          </ul>
        </div>
      </div>
    </div>
  </div>
{:else}
  NO NFTs or LOADING...?
{/if}

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

  .kre-media {
    max-height: 19vw;
  }

  .kre-action-buttons {
    width: 100%;
    margin-top: 13px;
  }

  .kre-blue-link {
    color: #192247;
    transition: all 300ms ease-in-out;
  }

  .kre-blue-link:hover {
    color: #3acf6e;
  }

  :global(
      .kre-action-buttons button.btn-sell-modal,
      .kre-action-buttons a.btn-transfer-modal,
      .kre-action-buttons a.btn-burn-modal,
      .kre-action-buttons a.btn-shortcod-modal,
      .kre-action-buttons a.btn-buy-modal
    ) {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 8px;
    background-color: white;
    border: 1px solid #e8e8e8;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    text-decoration: none;
    color: black;
  }

  :global(
      .kre-action-buttons a.btn-transfer-modal:hover,
      .kre-action-buttons a.btn-shortcod-modal:hover,
      .kre-action-buttons a.btn-shortcod-modal:hover i
    ) {
    background-color: #3acf6e;
    color: white;
  }

  .btn-burn-modal:hover {
    border-color: red !important;
    color: red !important;
  }

  .kre-flex-align-center {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  :global(.kre-flex-align-center .copy-ref) {
    margin-left: 15px;
  }

  #schortcodes .flex {
    width: 100%;
  }

  .kre-buy-widget-textarea {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 15px;
  }

  .kre-buy-widget-textarea textarea {
    width: 100%;
    height: 4em;
    border: 1px solid rgba(30, 30, 67, 0.1);
    background-color: rgba(105, 104, 104, 0.1);
    border-radius: 6px;
    padding: 8px;
    color: rgba(30, 30, 67, 0.4);
    font-weight: 300;
  }

  .kre-buy-widget-textarea a {
    margin-left: 15px;
    height: 3em;
    line-height: 1em;
    padding: 1em 1.2em;
  }

  /* Buy front CSS */
  .kre-wordpress-card {
    box-shadow: 0 0 20px rgb(0 0 0 / 10%);
    padding-bottom: 15px;
    border-radius: 6px;
    background-color: #fff;
  }

  .kre-wordpress-buttons {
    padding: 0 20px;
  }

  .kre-action-buttons.kre-wordpress-buttons {
    margin: 0;
  }

  .kre-buy-infos {
    margin: 0 0 15px 0;
    color: #192247;
  }

  .kre-buy-infos a {
    text-decoration: none;
  }

  .kre-buy-link {
    font-size: 16px;
  }
  .kre-buy-price {
    font-size: 20px;
    margin-top: 5px;
  }
</style>
