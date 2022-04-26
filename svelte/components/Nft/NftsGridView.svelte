<script lang="ts">
  import { get, Readable } from "svelte/store";

  import type { CollectionType, NftType } from "lib/ktypes";

  import {
    getShortAddress,
    nftUrl,
    explorerCollectionUrl,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftOpenSeaUrl,
    addressSame,
    textShort,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftKey,
    collectionUrl
  } from "lib/kconfig";
  import { nftGetImageLink } from "lib/knft-get-metadata";

  import { nftStore } from "stores/nft/nft";
  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <NftGridView {chainId} {address}  {account} {refreshing} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let refreshing: boolean = undefined;
  export let refresh: number = 1;

  export let platform = "dapp";

  let i = 1;
  let nfts: Readable<Map<string, NftType>>;
  let collection: Readable<CollectionType>;

  // HANDLE CHANGE : on truthy chainId, address and account, and whatever refresh
  $: refresh, chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFT LIST CHANGE #${i++} ${nftListKey(chainId, address, account)}`);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);

    // STATE VIEW : sync get NFT list
    nfts = nftStore.getSubListStore(chainId, address, account);

    // ACTION : async refresh NFT list
    refreshing = true;
    await nftStore.refreshSubList(chainId, address, account);
    refreshing = false;
  };

  ///////////////////////////////////////////////////////////////////////////////
  const divMediaImage = (src: string, height?: number) => {
    const heightString = height ? `height="${height}"` : "";
    return `<img alt="link" src=${src} ${heightString}/>`;
  };

  const divMediaVideo = (src: string, small = true) => {
    let video: string;
    if (small) {
      video = '<video preload="metadata" style="border-radius: initial;">';
    } else {
      video =
        '<video autoplay="true"  controls="" controlslist="nodownload" loop="" playsinline="" preload="metadata" style="border-radius: initial;">';
    }
    video += `<source src="${src}" type="video/mp4"></video>`;
    return video;
  };

  const divMedia = (_nft: NftType, index: number, small = false) => {
    const mediaContentType = _nft.contentType?.split("/");
    const mediaType = mediaContentType?.[0] || "image";

    const mediaSrc = nftGetImageLink(_nft);
    let div: string;
    if (small) {
      div = `<div id="media-small-${index}" class="media media-small media-${mediaType}">`;
    } else {
      div = `<div id="media-full-${index}" class="media media-${mediaType}">`;
    }
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else if (mediaType == "image") {
      div += divMediaImage(mediaSrc);
    } else {
      div += '<div class="media-text"></div>';
    }
    div += "</div>";

    // console.log("divMedia div", div);
    return div;
  };
</script>

<!-- {#if nfts && collection?.balanceOf > 0} -->
{#if $nfts}
  <h2>
    Collection {$collection?.name} || "NO NAME"}
  </h2>
  {$nfts?.size || 0}/{$collection?.balancesOf?.get(account) || $nfts?.size || 0}
  {$collection?.symbol || "NFT"}
  {#if refreshing}...{/if}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, address)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {collectionUrl(chainId, address)}"
    target="_blank"><i class="fas fa-info-circle" /></a
  >

  <div class="row grid-krd">
    {#each [...$nfts.values()] as nft, index}
      <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <!--  -->
        <!-- <KredeumGetNft {nft} {index} {platform} more={tokenID == Number(nft.tokenID) ? -1 : mores[index]} /> -->
        <!--  -->
        <div class="grid-card-krd">
          {@html divMedia(nft, index, true)}

          <div class="caption">
            <h3>{nftName(nft)}</h3>
            {#if addressSame(nft.owner, account)}
              <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
                Sell
              </a>
            {:else}
              <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
            {/if}
          </div>
        </div>

        {#if platform === "wordpress"}
          <div>WordPress</div>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <div class="card-krd">
    <p>
      {#if refreshing}
        <h2>Collection '{$collection?.name}'</h2>
        Refreshing NFTs...
      {:else}
        No NFTs ✌️
      {/if}
    </p>
  </div>
{/if}
