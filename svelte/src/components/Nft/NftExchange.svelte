<script lang="ts">
  import { nftMarketable, nftOwner, nftPrice } from "@common/nft/nft";
  import NftBuy from "./NftBuy.svelte";
  import NftSell from "./NftSell.svelte";
  import { nftStore } from "@svelte/stores/nft/nft";
  import { metamaskSignerAddress } from "@svelte/stores/metamask";
  import networks from "@common/common/networks";
  import { Address, formatEther } from "viem";

  /////////////////////////////////////////////////////////////////
  //  <NftExchange {chainId} {address} {tokenID} {mode}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: Address;
  export let tokenID: string;
  export let mode: string | undefined = undefined;
  /////////////////////////////////////////////////////////////////
  $: nft = nftStore(chainId, address, tokenID);
  /////////////////////////////////////////////////////////////////

  // $: console.log("<NftExchange nft", $nft);
  // $: console.log("<NftExchange nftOwner", nftOwner($nft), $metamaskSignerAddress);
</script>

{#if nftMarketable($nft)}
  {#if mode !== "detail"}
    <div class="overflow-ellipsis price">
      {#if nftPrice($nft) > 0n}
        <strong>{formatEther(nftPrice($nft))} {networks.getNativeCurrency(chainId)}</strong>
      {:else}
        &nbsp;
      {/if}
    </div>
  {/if}

  {#if nftOwner($nft) === $metamaskSignerAddress}
    <NftSell {chainId} {address} {tokenID} {mode} />
  {:else}
    <NftBuy {chainId} {address} {tokenID} {mode} />
  {/if}
{/if}

<style>
  .price {
    font-size: 20px;
    margin-top: 5px;
  }
</style>
