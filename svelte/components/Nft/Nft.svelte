<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/ktypes";

  import { constants, ethers, utils } from "ethers";
  import { metamaskChainId } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  import {
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    // getOpenSea,
    // nftOpenSeaUrl,
    // addressSame,
    getCurrency,
    kredeumNftHttp
  } from "@lib/common/kconfig";
  import { getMinPrice } from "@lib/nft/kautomarket";

  import MediaPreview from "../Media/MediaPreview.svelte";

  import { shortcode, autoMarketWidget } from "@helpers/shortcodes";

  import NftTransfer from "./NftTransfer.svelte";
  import NftBuy from "./NftBuy.svelte";
  import NftBurn from "./NftBurn.svelte";
  import NftSell from "./NftSell.svelte";
  // import NftClaim from "./NftClaim.svelte";

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

  let nftRoyaltyFeeAmount: number;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: nftRoyaltyFeeAmount = $nft?.royalty?.fee;

  $: console.info("Nft", $nft);
</script>

{#if $nft}
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3 {platform === 'buy-external' ? 'kre-buy-external-card' : ''}">
      <div class="card-krd kre-media">
        <MediaPreview nft={$nft} />
      </div>
      <div class="kre-action-buttons {platform === 'buy-external' ? 'kre-buy-external-buttons' : ''}">
        {#if $nft.owner === account && platform !== "buy-external"}
          <a href="#schortcodes" title="Get shortcode" class="btn-shortcod-modal"
            ><i class="fas fa-code fa-left c-green" /> GET SHORTCODE</a
          >

          <a href="#transfert-nft-{tokenID}" class="btn-transfer-modal" title="Make a gift"
            ><i class="fa fa-gift fa-left" /> TRANSFER</a
          >

          <a href="#burn-nft-{tokenID}" title="Burn Nft" class="btn-burn-modal"><i class="fa fa-fire fa-left" /> BURN</a
          >
        {/if}

        {#if platform === "buy-external"}
          <div class="kre-buy-infos">
            <div class="overflow-ellipsis kre-buy-link">
              <strong>
                <a href={kredeumNftHttp(chainId, $nft)} target="_blank" class="kre-blue-link">{$nft.name} #{tokenID}</a>
              </strong>
            </div>
            <div class="overflow-ellipsis kre-buy-price">
              <strong>{utils.formatEther($nft.price || 0)} {getCurrency(chainId)}</strong>
            </div>
          </div>
        {/if}

        {#if $nft.collection?.supports?.IOpenMarketable}
          {#if $nft.owner === account}
            <NftSell {chainId} {address} {tokenID} {platform} />
          {:else}
            <NftBuy
              {chainId}
              {address}
              {tokenID}
              nftPrice={$nft.price}
              nftOwner={$nft.owner}
              nftRoyalty={$nft.royalty}
              {platform}
            />
          {/if}
        {/if}
      </div>
    </div>

    {#if platform !== "buy-external"}
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
                <strong> <a href={kredeumNftUrl(chainId, $nft)} class="kre-blue-link">#{tokenID}</a></strong>
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
            {#if $nft.collection?.supports?.IOpenMarketable}
              {#if constants.Zero.lte($nft.price || 0)}
                <li>
                  <div class="flex"><span class="label">Nft Price</span></div>
                  <div class="flex">
                    <span
                      class="overflow-ellipsis {$nft.royalty?.minimum &&
                      $nft.price?.lt(getMinPrice($nft.royalty?.minimum)) &&
                      !$nft.price?.eq(0)
                        ? 'c-red'
                        : ''}"
                      title={ethers.utils.formatEther($nft.price || 0)}
                      target="_blank"
                    >
                      {utils.formatEther($nft.price || 0)}
                      {getCurrency(chainId)}
                    </span>
                  </div>
                </li>
              {/if}
              {#if $nft.royalty}
                <li>
                  <div class="flex"><span class="label">Nft Royalties Amount</span></div>
                  <div class="flex">
                    {#if nftRoyaltyFeeAmount == 0 || !nftRoyaltyFeeAmount}
                      <span class="overflow-ellipsis" title="no royalties">No royalties amount setted</span>
                    {:else}
                      <span class="link overflow-ellipsis" title={`${nftRoyaltyFeeAmount / 100} %`} target="_blank">
                        {nftRoyaltyFeeAmount / 100} %
                      </span>
                    {/if}
                  </div>
                </li>

                <li>
                  <div class="flex"><span class="label">Nft Royalty receiver</span></div>
                  <div class="flex">
                    <span class="overflow-ellipsis" title="Receiver of the royalties" target="_blank">
                      {#if $nft.royalty.account === constants.AddressZero}
                        "No receiver setted for Royalties"
                      {:else}
                        {@html explorerAddressLink(chainId, $nft.royalty.account, 15)}
                      {/if}
                    </span>
                  </div>
                </li>
              {/if}
            {/if}
          </ul>

          <div class="p-t-40 p-b-40 grid-buttons">
            <!-- {#if "wordpress" === platform}
            <a href="#schortcodes" class="btn btn-small btn-outline" title="Get shortcode"
              ><i class="fa fa-code" /><span>Get shortcode</span></a
            >
          {/if} -->

            <!-- {#if getOpenSea(chainId)}
            {#if addressSame($nft.owner, account)}
              <a href={nftOpenSeaUrl(chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
                Sell on OpenSea
              </a>
            {:else}
              <a href={nftOpenSeaUrl(chainId, $nft)} class="btn btn-small btn-buy" title="Buy" target="_blank">
                Buy on OpenSea
              </a>
            {/if}
          {/if} -->
          </div>
        </div>
      </div>
    {/if}
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
        <p>Click on the COPY button to copy the shortcode in your clipboard and then paste it in a WordPress page.</p>

        <ul class="steps">
          <li>
            <div class="flex"><span class="label">SELL on your website with buy widget</span></div>
            <div class="flex">
              <a
                on:click|preventDefault={() => autoMarketWidget($nft)}
                class="btn btn-small btn-outline"
                href="."
                title="Copy">Copy</a
              >
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">VIEW on OpenSea</span></div>
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

  :global(.kre-action-buttons button.btn-sell-modal, .kre-action-buttons a.btn-transfer-modal, .kre-action-buttons
      a.btn-burn-modal, .kre-action-buttons a.btn-shortcod-modal, .kre-action-buttons a.btn-buy-modal) {
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

  :global(.kre-action-buttons a.btn-transfer-modal:hover) {
    background-color: #3acf6e;
    color: white;
  }

  .btn-burn-modal:hover {
    border-color: red !important;
    color: red !important;
  }

  /* Buy front CSS */
  .kre-buy-external-card {
    box-shadow: 0 0 20px rgb(0 0 0 / 10%);
    padding-bottom: 15px;
    border-radius: 6px;
    background-color: #fff;
  }

  .kre-buy-external-buttons {
    padding: 0 20px;
  }

  .kre-action-buttons.kre-buy-external-buttons {
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
