<script lang="ts">
  import type { Readable } from "svelte/store";
  import { currentTokenID } from "main/current";

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

  import { shortcode } from "helpers/shortcodes";

  import { nftStore } from "stores/nft/nft";

  import NftTransfer from "./NftTransfer.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let platform: string = "dapp";
  let nft: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID);
  };

  const backToCollection = () => {
    currentTokenID.set("");
    // tokenID = "";
  };
</script>

{#if $nft}
  <h2 class="m-b-20 return">
    <i class="fa fa-arrow-left fa-left" /><a href="." on:click|preventDefault={backToCollection} class="link"
      >Return to collection</a
    >
  </h2>

  <div class="row grid-detail-krd">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        <div class="media media-grid media-photo">
          <a href="#zoom">
            <i class="fas fa-search" />
            <img src={$nft.image} alt={$nft.name} />
          </a>
        </div>
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
            <div class="flex"><strong>#{$nft.tokenID}</strong></div>
          </li>
          <li>
            <div class="flex"><span class="label">Owner</span></div>
            <div class="flex">{@html explorerAddressLink($nft.chainId, $nft.owner, 15)}</div>
          </li>
          <li>
            <div class="flex"><span class="label">Permanent link</span></div>
            <div class="flex">
              <a
                class="link overflow-ellipsis"
                href={kredeumNftUrl($nft.chainId, $nft)}
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
                href={explorerCollectionUrl($nft.chainId, $nft?.address)}
                title={$nft.address}
                target="_blank"
              >
                {$nft.address}
              </a>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Metadata ipfs</span></div>
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
          <a href="#transfert-$nft-{$nft.tokenID}" class="btn btn-small btn-outline" title="Make a gift"
            ><i class="fa fa-gift" /><span>Make a gift</span></a
          >

          {#if getNetwork($nft.chainId)?.openSea}
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

<!-- Modales of detail view -->
<!-- Modal Zoom -->
<div id="zoom" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="media media-photo">
          <a href="#zoom"><img src={$nft.image} alt={$nft.name} /></a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Shortcodes -->
<div id="schortcodes" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>
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
          <!-- <li>
            <div class="flex"><span class="label">Sell direclty on Gamestop</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="." title="Copy">Copy</a></div>
          </li>
          <li>
            <div class="flex"><span class="label">Mint on your front page</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="." title="Copy">Copy</a></div>
          </li>
          <li>
            <div class="flex"><span class="label">Sell directly without market-places</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="." title="Copy">Copy</a></div>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Modal gift -->
<div id="transfert-$nft-{$nft.tokenID}" class="modal-window">
  <NftTransfer {chainId} {address} {tokenID} />
</div>
<!-- <div id="gift" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-gift fa-left c-green" />
          Make a gift
        </div>
        <p>Enter the recipient account address.</p>

        <form method="POST" action="" enctype="multipart/form-data">
          <div class="section">
            <div class="form-field">
              <input type="text" id="gift" name="gift" placeholder="Enter the recipient's address" />
            </div>
          </div>
          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div> -->
