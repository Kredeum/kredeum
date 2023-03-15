<script lang="ts">
  import { nftMarketable, nftOwner, nftPrice } from "@helpers/nft";
  import NftBuy from "./NftBuy.svelte";
  import NftSell from "./NftSell.svelte";
  import { nftStore } from "@stores/nft/nft";
  import { metamaskSignerAddress } from "@main/metamask";
  import { utils } from "ethers";
  import { getCurrency } from "@lib/common/config";

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
  /////////////////////////////////////////////////////////////////

  // $: console.log("<NftExchange nft", $nft);
  // $: console.log("<NftExchange nftOwner", nftOwner($nft), $metamaskSignerAddress);
</script>

{#if nftMarketable($nft)}
  <div class="kre-buy-infos">
    <div class="overflow-ellipsis kre-buy-price">
      <strong>{utils.formatEther(nftPrice($nft))} {getCurrency(chainId)}</strong>
    </div>

    {#if nftOwner($nft) === $metamaskSignerAddress}
      <NftSell {chainId} {address} {tokenID} {platform} />
    {:else}
      <NftBuy {chainId} {address} {tokenID} {platform} />
    {/if}
  </div>
{/if}

<style>
  .kre-buy-price {
    font-size: 20px;
    margin-top: 5px;
  }
</style>
