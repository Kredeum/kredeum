<script lang="ts">
  import { providerSetFallback } from "@lib/common/provider-get";
  import { onMount } from "svelte";
  import Nft from "../Nft/Nft.svelte";

  /////////////////////////////////////////////////////////////////
  // <NftAutomarket {chainId} {address} {tokenID} {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId = 1;
  export let address: string;
  export let tokenID: string;
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////////

  $: console.log(platform);

  onMount(() => providerSetFallback(chainId).catch(console.error));
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
