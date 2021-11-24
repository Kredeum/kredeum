<script lang="ts">
  import { Collection, getNetwork, getShortAddress, Network, Nft } from "lib/kconfig";
  import {
    sleep,
    collectionName,
    explorerCollectionInventoryUrl,
    nftImageLink,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftsSupplyAndName,
    nftOpenSeaUrl,
    nftExplorerLink,
    addressSame,
    textShort,
    explorerNftUrl
  } from "lib/knfts";

  import { nftUrl, nftsUrl } from "lib/kconfig";
  import { listNFTsTokenIds, listNFTsFromCache, addNftMetadata } from "lib/klist-nfts";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let network: Network;

  let NFTs: Map<string, Nft>;
  let allNFTs: Map<string, Nft>;
  let Collections: Array<Collection>;
  let nftImport: number;

  // export let beta: string = undefined; // platform : WordPress or Dapp
  export const platform: string = undefined; // platform : WordPress or Dapp

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let collection: Collection = undefined;
  export let refreshing: boolean;

  export const refreshNFTs = async () => {
    network = getNetwork(chainId);

    if (network && address && collection) {
      // Concurrent runs make collection undefined in this block !
      const collectionAddress = collection.address;

      allNFTs = listNFTsFromCache();
      NFTs = new Map(
        [...allNFTs].filter(
          ([, nft]) => nft.chainId === chainId && nft.collection === collectionAddress
        )
      );
      refreshing = true;

      const nftsMap = await listNFTsTokenIds(chainId, collectionAddress, address);
      const nftsTokenIds = [...nftsMap.values()];

      for (let index = 0; index < nftsTokenIds.length; index++) {
        const nftTokenId = nftsTokenIds[index];
        console.log("nftTokenId nid", nftTokenId.nid, index, nftsTokenIds.length, nftTokenId);

        const nft = await addNftMetadata(chainId, collectionAddress, nftTokenId);

        console.log("nftWithMetadata nid", nft.nid, nft);

        if (nft.chainId === chainId && nft.collection === collectionAddress) NFTs.set(nft.nid, nft);
        else break;
      }
      refreshing = false;
    }
  };

  // ON NETWORK, ADDRESS OR COLLECTION CHANGE
  $: if (chainId && address && collection) refreshNFTs();

  $: console.log("collection changed !", collection);

  const dispatchImport = async (nft: Nft) => {
    nftImport = 1;
    dispatch("import", { nft });
    while ((window as any).ajaxResponse == false) await sleep(1000);
    nftImport = 2;
  };

  const moreToggle = (i: number) => {
    const divTableDrop = document.getElementById(`table-drop-${i}`);
    const divMoreDetail = document.getElementById(`more-detail-${i}`);
    const divDescShort = document.getElementById(`description-short-${i}`);
    divDescShort.classList.toggle("hidden");
    divTableDrop.classList.toggle("closed");
    divTableDrop.style.height = divTableDrop.classList.contains("closed")
      ? "auto"
      : `${divMoreDetail.offsetHeight + 70}px`;
  };
</script>

{#key address && refreshing}
  {#if NFTs?.size > 0}
    <h2>
      Collection {collectionName(collection)}
    </h2>
    {nftsSupplyAndName(NFTs, collection)}
    <a
      class="info-button"
      href={explorerCollectionInventoryUrl(chainId, collection?.address)}
      title="&#009;Collection address (click to view collection in explorer)&#013;{nftsUrl(
        chainId,
        collection?.address
      )}"
      target="_blank"><i class="fas fa-info-circle" /></a
    >

    <div class="table">
      <div class="table-row table-head hidden-xs">
        <div class="table-col"><span class="label">Media</span></div>
        {#if network?.openSea}
          <div class="table-col"><span class="label">Marketplace</span></div>
        {:else}
          <div class="table-col"><span class="label">Infos</span></div>
        {/if}
      </div>
      {#each [...NFTs.values()] as nft, i}
        <div id="table-drop-{i}" class="table-row table-drop closed">
          <div id="media-{i}" class="table-col">
            <div class="table-col-content">
              <div class="media media-small media-photo">
                <img alt="link" src={nftImageLink(nft)} height="100" />
              </div>
              <strong>{nftName(nft)}</strong>
              <span id="description-short-{i}">{nftDescriptionShort(nft, 64)}</span>
              <a
                class="info-button"
                href={nftImageLink(nft)}
                title="&#009;{nftDescription(nft)} 
                (click to view NFT in explorer)&#013.{nftUrl(nft)}"
                target="_blank"><i class="fas fa-info-circle" /></a
              >
            </div>
          </div>

          {#if network?.openSea}
            <div id="marketplace-{i}" class="table-col">
              <div class="table-col-content">
                {#if addressSame(nft.owner, address)}
                  <a
                    href={nftOpenSeaUrl(chainId, nft)}
                    class="btn btn-small btn-sell"
                    title="Sell"
                    target="_blank"
                  >
                    Sell
                  </a>
                {:else}
                  <a
                    href={nftOpenSeaUrl(chainId, nft)}
                    class="btn btn-small btn-sell"
                    title="Buy"
                    target="_blank"
                  >
                    Buy
                  </a>
                {/if}
              </div>
            </div>
          {:else}
            <div class="table-col">
              <div class="table-col-content">
                <a
                  class="info-button"
                  href={nftImageLink(nft)}
                  title="&#009;{nftDescription(nft)} 
                  (click to view NFT in explorer)&#013.{nftUrl(nft)}"
                  target="_blank"><i class="fas fa-info-circle" /></a
                >
              </div>
            </div>
          {/if}

          <div id="more-{i}" class="table-col more" on:click={() => moreToggle(i)}>
            <div class="table-col-content txtright">
              <div class="more-button"><i class="fas fa-chevron-down" /></div>
            </div>
          </div>

          <div id="more-detail-{i}" class="detail">
            <div id="media-full-{i}" class="media media-photo">
              <img alt="link" src={nftImageLink(nft)} />
            </div>
            <div id="description-{i}" class="description">
              <strong>Description</strong>
              <p>
                {nftDescription(nft)}
              </p>
              <ul class="steps">
                <li class="complete">
                  <div class="flex"><span class="label">Token ID</span></div>
                  <div class="flex">
                    <strong>{nft.tokenID}</strong>
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Token REF</span></div>
                  <div class="flex">
                    <a class="link" href={explorerNftUrl(nft.chainId, nft)} target="_blank">
                      {@html nftExplorerLink(nft, 10)}
                    </a>
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Collection @</span></div>
                  <div class="flex">
                    <a class="link" href={nftUrl(nft)} target="_blank"
                      >{getShortAddress(collection?.address, 15)}</a
                    >
                  </div>
                </li>

                <li class="complete">
                  <div class="flex"><span class="label">Metadata CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.tokenURI} target="_blank">{textShort(nft.cidJson)}</a>
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Image CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.image} target="_blank">{textShort(nft.cid)}</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="card-krd">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}
