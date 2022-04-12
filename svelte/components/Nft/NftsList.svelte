<script lang="ts">
  import type { Collection as CollectionType, Nft as NftType } from "lib/ktypes";
  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, collectionUrl } from "lib/kconfig";
  import { getNetwork } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";
  // import NftSimple from "../tests/NftSimple.svelte";
  import { nftListStore } from "stores/nft/nftList";

  /////////////////////////////////////////////////
  // <NftList {chainId} {collection}  {account} {refreshing} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let refreshing: boolean = undefined;

  // ACTION : async NFT list update
  $: nftListStore.refresh(chainId, address, account).catch(console.error);

  // STATE VIEW : NFT list
  $: nfts = nftListStore.getSubList(chainId, address);

  let nbNFTs: number;
  $: nbNFTs = $nfts?.size || 0;
</script>

{#if $nfts?.size > 0}
  <h2>Collection name</h2>
  {nbNFTs}/N
  {#if refreshing}...{/if}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, address)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {collectionUrl(chainId, address)}"
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
    {#each [...$nfts.values()] as nft, index}
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
