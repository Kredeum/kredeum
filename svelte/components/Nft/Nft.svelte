<script lang="ts">
  import { constants, utils } from "ethers";

  import {
    explorerCollectionUrl,
    explorerAddressLink,
    getDappUrl,
    getAutoswarmUrl,
    copyToClipboard,

    textShort,
    displayEther,
    uriShort
  } from "@lib/common/config";

  import MediaPreview from "../Media/MediaPreview.svelte";
  import NftExchange from "./NftExchange.svelte";

  import { shortcodeOpenSky } from "@helpers/shortcode";
  import {
    nftOwner,
    nftMarketable,
    nftRoyaltyAccount,
    nftRoyalty,
    nftRoyaltyFee,
    nftPrice,
    nftPriceValid
  } from "@lib/nft/nft";

  import NftClaim from "./NftClaim.svelte";
  import NftTransfer from "./NftTransfer.svelte";
  import NftBurn from "./NftBurn.svelte";
  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import { nftStoreAndRefresh } from "@stores/nft/nft";
  import { widgetOpenSky } from "@helpers/widget";
  import { storageUriGetImage, storageLinkToUrlHttp, sorageLinkToUri } from "@lib/nft/storage/storage";
  import { networks } from "@lib/common/networks";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} {owner}? />
  // Display NFT solo
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let owner: string = undefined;
  export let mode: string = undefined;
  export let details: boolean = undefined;
  /////////////////////////////////////////////////////////////
  $: nft = nftStoreAndRefresh(chainId, address, tokenID);
  /////////////////////////////////////////////////////////////
  $: console.info("NFT", $nft);

  let nftLink = "";
  let nftLinkDone = "";
  const copyDappLink = () => (nftLink = getDappUrl(chainId, { address, tokenID }));
  const copyAutoswarmLink = () => (nftLink = getAutoswarmUrl(chainId, { address, tokenID }));
  const copyBlurLink = () => (nftLink = networks.getBlurUrl(chainId, { address, tokenID }));
  const copyOpenSeaLink = () => (nftLink = networks.getOpenSeaUrl(chainId, { address, tokenID }));

  const copyLinkToClipboard = (evt: Event, label?: string) => {
    copyToClipboard(nftLink).catch(console.error);
    nftLinkDone = `Done!  ${label} copied to your clipboard...`;
    setTimeout(() => (nftLinkDone = ""), 3000);
  };

  let openSkyShortcode = "";
  let openSkyWidget = "";
  const copyShortcodeOpenSky = (all = false) => (openSkyShortcode = shortcodeOpenSky($nft, all));
  const copyWidgetOpenSky = (all = false) => (openSkyWidget = widgetOpenSky($nft, all));

  const copyShortcodeToClipboard = (evt: Event, label?: string) => {
    copyToClipboard(openSkyShortcode).catch(console.error);
    const openSkyShortcodeDone = openSkyShortcode;
    openSkyShortcode = `Done!  ${label} shortcode copied to your clipboard...`;
    setTimeout(() => (openSkyShortcode = openSkyShortcodeDone), 3000);
  };
  const copyWidgetToClipboard = (evt: Event, label?: string) => {
    copyToClipboard(openSkyWidget).catch(console.error);
    const openSkyWidgetDone = openSkyWidget;
    openSkyWidget = `Done!  ${label} widget copied to your clipboard...`;
    setTimeout(() => (openSkyWidget = openSkyWidgetDone), 3000);
  };
</script>

{#if $nft}
  <div class="{mode == 'detail' ? 'row' : ''} kre-nft-solo">
    <div class={mode == "detail" ? "col col-xs-12 col-sm-4 col-md-3" : "kre-web-card"}>
      <div class="card-krd kre-media">
        <MediaPreview {chainId} {address} {tokenID} {mode} />
      </div>

      <div class="kre-action-buttons {mode == 'detail' ? '' : 'kre-web-buttons'}">
        {#if details}
          <a href="#schortcodes" title="Share" class="btn-share-modal"
            ><i class="fas fa-share fa-left c-green" /> SHARE</a
          >

          {#if nftOwner($nft) === owner}
            <a href="#claim-nft-{tokenID}" class="btn-claim-modal" title="Claim this NFT"
              ><i class="fa fa-hand-holding-usd fa-left" /> CLAIM</a
            >

            <a href="#transfert-nft-{tokenID}" class="btn-transfer-modal" title="Make a gift"
              ><i class="fa fa-gift fa-left" /> TRANSFER</a
            >

            <a href="#burn-nft-{tokenID}" title="Burn Nft" class="btn-burn-modal"
              ><i class="fa fa-fire fa-left" /> BURN</a
            >
          {/if}
        {:else}
          <div class="overflow-ellipsis kre-description-link">
            <strong>
              <a href={getDappUrl(chainId, $nft)} target="_blank" rel="noreferrer" class="kre-blue-link"
                >{$nft.name} #{tokenID}</a
              >
            </strong>
          </div>
        {/if}

        <NftExchange {chainId} {address} {tokenID} {mode} />
      </div>
    </div>

    {#if details}
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
                  <strong> <a href={getDappUrl(chainId, $nft)} class="kre-blue-link">#{tokenID}</a></strong>
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
                      href={storageLinkToUrlHttp($nft.tokenURI)}
                      title={$nft.tokenURI}
                      target="_blank"
                      rel="noreferrer">{uriShort($nft.tokenURI)}</a
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
                  <a class="link" href={$nft.image} title={storageUriGetImage($nft)} target="_blank" rel="noreferrer">
                    {uriShort(storageUriGetImage($nft)) || ""}
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
                    <a
                      class="link"
                      href={$nft.animation_url}
                      title={$nft.animation_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {$nft.animation_url || ""}
                    </a>
                  </div>
                  <CopyRefItem copyData={$nft.animation_url || ""} />
                </div>
              </li>
            {/if}
            {#if $nft.pdf}
              <li>
                <div class="flex"><span class="label">PDF</span></div>
                <div class="flex kre-flex-align-center">
                  <div class="overflow-ellipsis">
                    <a class="link" href={$nft.pdf} title={$nft.pdf} target="_blank" rel="noreferrer">
                      {uriShort(sorageLinkToUri($nft.pdf)) || ""}
                    </a>
                  </div>
                  <CopyRefItem copyData={$nft.pdf || ""} />
                </div>
              </li>
            {/if}
            {#if nftMarketable($nft)}
              {#if nftPrice($nft).gt(0)}
                <li>
                  <div class="flex"><span class="label">Nft Price</span></div>
                  <div class="flex kre-flex-align-center">
                    <div class="overflow-ellipsis">
                      <span class={nftPriceValid($nft) ? "" : "c-red"} title={utils.formatEther(nftPrice($nft))}>
                        {displayEther(chainId, nftPrice($nft))}
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
                        <span title="no royalties">No royalties amount settled</span>
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
                          "No receiver settled for Royalties"
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
            <i class="fas fa-share fa-left c-green" />
            SHARE this NFT
          </div>

          <ul class="steps">
            <li>
              <div class="flex"><span class="label">COPY TO SHARE LINK TO THIS NFT</span></div>
              <div class="flex kre-buy-widget-textarea">
                <a
                  on:mouseover={copyDappLink}
                  on:focus={copyDappLink}
                  on:click|preventDefault={(evt) => copyLinkToClipboard(evt, "Dapp link")}
                  class="btn btn-small btn-outline"
                  href={getDappUrl(chainId, { address, tokenID })}
                  target="_blank">COPY DAPP LINK</a
                >
                <a
                  on:mouseover={copyAutoswarmLink}
                  on:focus={copyAutoswarmLink}
                  on:click|preventDefault={(evt) => copyLinkToClipboard(evt, "Autoswarm link")}
                  class="btn btn-small btn-outline"
                  href={getAutoswarmUrl(chainId, { address, tokenID })}
                  target="_blank">COPY AUTOSWARM LINK</a
                >
                {#if networks.getOpenSea(chainId)}
                  <a
                    on:mouseover={copyOpenSeaLink}
                    on:focus={copyOpenSeaLink}
                    on:click|preventDefault={(evt) => copyLinkToClipboard(evt, "OpenSea link")}
                    class="btn btn-small btn-outline"
                    href={networks.getOpenSeaUrl(chainId, { address, tokenID })}
                    target="_blank"
                  >
                    COPY OPENSEA LINK</a
                  >
                {/if}
                {#if networks.getBlur(chainId)}
                  <a
                    on:mouseover={copyBlurLink}
                    on:focus={copyBlurLink}
                    on:click|preventDefault={(evt) => copyLinkToClipboard(evt, "Blur link")}
                    class="btn btn-small btn-outline"
                    href={networks.getBlurUrl(chainId, { address, tokenID })}
                    target="_blank">COPY BLUR LINK</a
                  >
                {/if}
              </div>
              <div class="flex kre-buy-widget-textarea">
                {#if nftLinkDone}
                  <p>{nftLinkDone}</p>
                {:else}
                  <a href={nftLink} target="_blank">{textShort(nftLink, 24)}</a>
                {/if}
              </div>
            </li>

            {#if nftMarketable($nft)}
              <li>
                <div class="flex">
                  <span class="label">COPY TO INTEGRATE THIS NFT OR COLLECTION IN WORDPRESS</span>
                </div>
                <div class="flex kre-buy-widget-textarea">
                  <a
                    on:mouseover={() => copyShortcodeOpenSky()}
                    on:focus={() => copyShortcodeOpenSky()}
                    on:click|preventDefault={(evt) => copyShortcodeToClipboard(evt, "WordPress NFT shortcode")}
                    class="btn btn-small btn-outline"
                    href="."
                    title="shortcodeAutoMarket($nft)">COPY NFT SHORTCODE</a
                  >
                  <a
                    on:mouseover={() => copyShortcodeOpenSky(true)}
                    on:focus={() => copyShortcodeOpenSky(true)}
                    on:click|preventDefault={(evt) => copyShortcodeToClipboard(evt, "WordPress Collection shortcode")}
                    class="btn btn-small btn-outline"
                    href="."
                    title="shortcodeAutoMarket($nft, true)">COPY COLLECTION SHORTCODE</a
                  >
                </div>
                <div class="flex kre-buy-widget-textarea"><textarea value={openSkyShortcode} /></div>
              </li>
              <li>
                <div class="flex">
                  <span class="label">COPY TO INTEGRATE THIS NFT OR COLLECTION IN AN HTML PAGE</span>
                </div>
                <div class="flex kre-buy-widget-textarea">
                  <a
                    on:mouseover={() => copyWidgetOpenSky()}
                    on:focus={() => copyWidgetOpenSky()}
                    on:click|preventDefault={(evt) => copyWidgetToClipboard(evt, "WordPress NFT shortcode")}
                    class="btn btn-small btn-outline"
                    href="."
                    title="shortcodeAutoMarket($nft)">COPY NFT WIDGET</a
                  >
                  <a
                    on:mouseover={() => copyWidgetOpenSky(true)}
                    on:focus={() => copyWidgetOpenSky(true)}
                    on:click|preventDefault={(evt) => copyWidgetToClipboard(evt, "WordPress Collection shortcode")}
                    class="btn btn-small btn-outline"
                    href="."
                    title="shortcodeAutoMarket($nft, true)">COPY COLLECTION WIDGET</a
                  >
                </div>
                <div class="flex kre-buy-widget-textarea"><textarea value={openSkyWidget} /></div>
              </li>
            {/if}
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
<div id="claim-nft-{tokenID}" class="modal-window">
  <NftClaim {chainId} {address} {tokenID} />
</div>

<style>
  .kre-media {
    max-height: 33vh;
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
      .kre-action-buttons button.btn-detail,
      .kre-action-buttons button.btn-buy-modal,
      .kre-action-buttons button.btn-claim-modal,
      .kre-action-buttons a.btn-transfer-modal,
      .kre-action-buttons a.btn-claim-modal,
      .kre-action-buttons a.btn-burn-modal,
      .kre-action-buttons a.btn-share-modal,
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
      .kre-action-buttons a.btn-claim-modal:hover,
      .kre-action-buttons a.btn-transfer-modal:hover,
      .kre-action-buttons a.btn-share-modal:hover,
      .kre-action-buttons a.btn-share-modal:hover i
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

  .kre-web-buttons {
    padding: 0 20px;
  }

  .kre-action-buttons.kre-web-buttons {
    margin: 0;
  }

  .kre-description-link a {
    text-decoration: none;
  }

  .kre-description-link {
    font-size: 16px;
  }
</style>
