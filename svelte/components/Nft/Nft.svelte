<script lang="ts">
  import type { Readable } from "svelte/store";

  import { ethers } from "ethers";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getOpenSea,
    nftOpenSeaUrl,
    addressSame
  } from "lib/kconfig";

  import MediaPreview from "../Media/MediaPreview.svelte";

  import { shortcode } from "helpers/shortcodes";
  import { nftStore } from "stores/nft/nft";

  import NftTransfer from "./NftTransfer.svelte";
  import NftBuy from "./NftBuy.svelte";

  import { setTokenPrice } from "lib/kautomarket";

  // import NftClaim from "./NftClaim.svelte";

  import { metamaskChainId, metamaskSigner } from "main/metamask";

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

  let setPrice: string;
  let newNftPrice: string;

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

  $: console.log("Nft", $nft);

  $: setPrice && handlePrice();
  const handlePrice = () => {
    setPrice = setPrice.replace(/[^0-9.,]/g, "");
    let formatedInputPrice = setPrice.replace(/[,]/g, ".");
    const decimals = formatedInputPrice.split(".")[1];
    if (decimals?.length > 18) {
      setPrice = setPrice.slice(0, -1);
      formatedInputPrice = formatedInputPrice.slice(0, -1);
    }

    // const priceToConvert = inputPrice.replace(/[,]/g, ".").replace(/[^0-9.]/g, "");
    if (setPrice) newNftPrice = formatedInputPrice;

    console.log("nftPrice : ", newNftPrice, " Wei");
  };

  const displayPriceInput = () => {
    setPrice = $nft?.price;
  };

  const setNewTokenPrice = () => {
    setTokenPrice(chainId, address, $metamaskSigner, tokenID, newNftPrice);
  };
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
                <span class="link overflow-ellipsis" title={$nft.price} target="_blank">
                  {#if setPrice}
                    <input type="text" bind:value={setPrice} id="set-price-nft" />
                    <span on:click={setNewTokenPrice} class="btn btn-small btn-outline" title="Confirm token price"
                      ><i class="fa fa-check" /> Confirm</span
                    >
                  {:else}
                    {$nft.price || "0"} Eth
                    <span on:click={displayPriceInput} class="btn btn-small btn-outline" title="Set price"
                      ><i class="fa fa-usd" /> Set price</span
                    >
                  {/if}
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
          <a href="#transfert-nft-{tokenID}" class="btn btn-small btn-outline" title="Make a gift"
            ><i class="fa fa-gift" /> Transfer</a
          >

          {#if $nft.owner !== account}
            <a href="#buy-nft-{tokenID}" class="btn btn-small btn-outline" title="Buy this nft"
              ><i class="fa fa-shopping-cart" /> Buy</a
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

<!-- Modal buy nft -->
<div id="buy-nft-{tokenID}" class="modal-window">
  <NftBuy {chainId} {address} {tokenID} nftPrice={$nft?.price} />
</div>

<!-- Modal claim nft -->

<!-- <div id="claim-nft-{tokenID}" class="modal-window">
  <NftClaim {chainId} {address} {tokenID} />
</div> -->
<style>
  .krd-nft-solo {
    width: 100%;
  }
</style>
