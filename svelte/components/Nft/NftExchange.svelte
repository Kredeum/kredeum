<script lang="ts">
  import { nftMarketable, nftOwner } from "@helpers/nft";
  import NftBuy from "./NftBuy.svelte";
  import NftSell from "./NftSell.svelte";
  import { nftStore } from "@stores/nft/nft";
  import { metamaskSignerAddress } from "@main/metamask";

  /////////////////////////////////////////////////////////////////
  //  <NftExchange {chainId} {address} {tokenID} {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////////

  $: nft = nftStore.getOne(chainId, address, tokenID);
  $: console.log("<NftExchange nft", $nft);
  $: console.log("<NftExchange nftOwner", nftOwner($nft), $metamaskSignerAddress);
</script>

{#if nftMarketable($nft)}
  {#if nftOwner($nft) === $metamaskSignerAddress}
    <NftSell {chainId} {address} {tokenID} {platform} />
  {:else}
    <NftBuy {chainId} {address} {tokenID} {platform} />
  {/if}
{/if}
