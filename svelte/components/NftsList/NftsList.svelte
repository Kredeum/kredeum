<script lang="ts">
  import type { Collection as CollectionType, Nft as NftType } from "lib/ktypes";
  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, collectionUrl } from "lib/kconfig";
  import { getNetwork } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";

  /////////////////////////////////////////////////
  // <NftList {chainId} {collectionObject}  {account} {refreshing} {platform} {nftsList}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collectionObject: CollectionType;
  export let account: string = undefined;
  export let refreshing: boolean; // platform : wordPress or dapp

  let nfts: Map<string, NftType>;
  let nbNFTs: number;
  $: nbNFTs = nfts?.size || 0;
</script>

{#if nfts?.size > 0}
  <h2>
    Collection {collectionName(collectionObject)}
  </h2>
  {nbNFTs}/{nftsBalanceAndName(collectionObject, account)}
  {#if refreshing}...{/if}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, collectionObject.address)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {collectionUrl(chainId, collectionObject.address)}"
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
    <p>
      {#if refreshing}
        Refreshing NFTs...
      {:else}
        No NFTs ✌️
      {/if}
    </p>
  </div>
{/if}
