<script lang="ts">
  import { onMount } from "svelte";

  import { hashArray } from "helpers/hash";
  import type { Collection, Nft as NftType } from "lib/ktypes";

  import Nft from "../Nft/Nft.svelte";

  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, nftsUrl } from "lib/kconfig";
  import { nftListTokenIds, nftListFromCache } from "lib/knft-list";
  import { nftGetFromContractEnumerable } from "lib/knft-get";
  import { nftGetMetadata } from "lib/knft-get-metadata";
  import { getNetwork } from "lib/kconfig";
  import { collectionGet, collectionGetFromCache } from "lib/kcollection-get";
  import { cacheClear } from "lib/kcache";

  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <NftList {chainId} {collectionObject}  {account} {refreshing} {platform} {nftsList}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let chainId: number;
  export let collection: string;
  export let account: string = undefined;
  export let platform = ""; // platform : wordPress or dapp

  let refresh = true;

  let collectionObject: Collection;
  let numNFT: number;
  let nbNFTs: number;

  let allNFTs: Map<string, NftType>;
  let mores: Array<number> = [];

  $: nbNFTs = nfts?.size || 0;

  onMount(() => {
    console.log("NftsList onMount");
  });
</script>

{nfts?.size} nfts
{#if nfts?.size > 0}
  <h2>
    Collection {collectionName(collectionObject)}
  </h2>
  {nbNFTs}/{nftsBalanceAndName(collectionObject)}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, collection)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {nftsUrl(chainId, collection)}"
    target="_blank"><i class="fas fa-info-circle" /></a
  >

  <div class="table">
    <div class="table-row table-head hidden-xs">
      <div class="table-col"><span class="label">Media</span></div>
      {#if getNetwork(chainId)?.openSea}
        <div class="table-col"><span class="label">Marketplace</span></div>
      {:else}
        <div class="table-col"><span class="label">Infos</span></div>
      {/if}
    </div>
    {#each [...nfts.values()] as nft, index}
      <!-- <NftGet chainId={nft.chainId} collection={nft.collection} tokenID={nft.tokenID} /> -->
      <Nft {nft} {account} />
      <!-- <Nft {nft} {account} {index} {platform} more={tokenID == nft.tokenID ? -1 : mores[index]} /> -->
    {/each}
  </div>
{:else}
  <div class="card-krd">
    <p>No NFTs ✌️</p>
  </div>
{/if}
