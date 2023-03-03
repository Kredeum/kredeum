<script lang="ts">
  import { initSnippet } from "@helpers/init";
  import { onMount } from "svelte";
  import Nft from "../Nft/Nft.svelte";

  /////////////////////////////////////////////////////////////////
  // <NftAutomarket {chainId} {address} {tokenID} {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////////

  $: console.log(platform);

  // Metamask init
  onMount(async () => initSnippet(chainId, address, tokenID));
</script>

<div class="nft-automarket">
  <Nft {chainId} {address} {tokenID} {platform} />
</div>

<style>
  :global(.nft-automarket) {
    width: 300px;
  }

  .nft-automarket {
    font-family: "Work Sans", Arial, sans-serif;
    line-height: 1.3;
    font-size: 16px;
  }
</style>
