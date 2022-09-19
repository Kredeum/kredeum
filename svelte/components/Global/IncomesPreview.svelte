<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { onMount } from "svelte";

  import { config, getNetwork } from "@lib/common/kconfig";

  export let nft: NftType;
  export let price: string = "";

  let sellerIncome;
  let receiverFeeAmount;
  let kredeumFeeAmunt;

  $: price && handleSellIncomes();
  const handleSellIncomes = () => {
    kredeumFeeAmunt = BigNumber.from(price).mul(config.treasury.fee).div(10000);
    receiverFeeAmount = BigNumber.from(price).mul(BigNumber.from(nft.royaltyAmount)).div(10000);
    sellerIncome = BigNumber.from(price).sub(kredeumFeeAmunt.add(receiverFeeAmount));
  };

  $: nft && handleNftChanges();
  const handleNftChanges = () => {
    price = nft.price;
  };

  onMount(() => {
    if (!price) price = nft.price;
  });
</script>

{#if (Number(nft.price) > 0 || Number(price) > 0) && sellerIncome && receiverFeeAmount && kredeumFeeAmunt}
  <div class="section">
    <span class="label">Sell Incomes preview</span>
    <p>
      {utils.formatEther(sellerIncome)}
      {getNetwork(nft.chainId).nativeCurrency.symbol} for the Seller : {nft.owner}
    </p>
    <p>
      {utils.formatEther(receiverFeeAmount)}
      {getNetwork(nft.chainId).nativeCurrency.symbol} for the Royalty receiver : {nft.royaltyReceiver}
    </p>
    <p>
      {utils.formatEther(kredeumFeeAmunt)}
      {getNetwork(nft.chainId).nativeCurrency.symbol} for your obliged Kredeum Nfts Factory :)
    </p>
  </div>
{/if}
