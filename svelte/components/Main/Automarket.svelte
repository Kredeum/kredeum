<script lang="ts">
  import { initSnippet } from "@helpers/initSnippet";
  import { onMount } from "svelte";
  import Nft from "../Nft/Nft.svelte";
  import NftsGrid from "../Nfts/NftsGrid.svelte";
  import { nftSubListGetStoreAndRefresh } from "@stores/nft/nftSubList";

  /////////////////////////////////////////////////////////////////
  // <NftAutomarket {chainId} {address} {tokenID} {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenIDs: string = "";
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListGetStoreAndRefresh(chainId, address);
  ////////////////////////////////////////////////////////////////////////

  let tokenIDsArrray: Array<string> = [];

  // Metamask init
  onMount(async () => {
    initSnippet(chainId, address, tokenIDs);

    if (tokenIDs) {
      tokenIDsArrray = tokenIDs.split(",");
    }
  });
</script>

<div class="nft-automarket">
  {#each [...$nfts] as [key, nft]}
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
  {/each}
</div>
