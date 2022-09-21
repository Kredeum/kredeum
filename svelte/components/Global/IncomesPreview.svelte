<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { onMount } from "svelte";

  import { config, getNetwork } from "@lib/common/kconfig";

  export let nft: NftType;
  export let price: string = "";

  let sellerIncome: BigNumber = BigNumber.from(0);
  let receiverFeeAmount: BigNumber = BigNumber.from(0);
  let kredeumFeeAmount: BigNumber = BigNumber.from(0);

  $: price && handleSellIncomes();
  const handleSellIncomes = () => {
    kredeumFeeAmount = BigNumber.from(price).mul(config.treasury.fee).div(10000);
    receiverFeeAmount = BigNumber.from(price).mul(BigNumber.from(nft.royaltyAmount)).div(10000);
    sellerIncome = BigNumber.from(price).sub(kredeumFeeAmount.add(receiverFeeAmount));
  };

  // $: nft && handleNftChanges();
  // const handleNftChanges = () => {
  //   price = nft.price;
  // };

  onMount(() => {
    if (!price) price = nft.price;
    handleSellIncomes();
  });
</script>

<!-- {#if (Number(nft.price) > 0 || Number(price) > 0) && sellerIncome && receiverFeeAmount && kredeumFeeAmount} -->
<div class="section">
  <span class="label">Price splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p>
          {utils.formatEther(sellerIncome)}
          {getNetwork(nft.chainId).nativeCurrency.symbol} to seller
        </p>
        <p>{nft.owner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {utils.formatEther(receiverFeeAmount)}
          {getNetwork(nft.chainId).nativeCurrency.symbol} ({Number(nft.royaltyAmount) / 100} %) royalties to creator
        </p>
        <p>{nft.royaltyReceiver}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {utils.formatEther(kredeumFeeAmount)}
          {getNetwork(nft.chainId).nativeCurrency.symbol} ({config.treasury.fee / 100} %) fees
        </p>
        <p>Send to your obliged Kredeum Nfts Factory :)</p>
      </div>
    </li>
  </ul>
</div>

<!-- {/if} -->
<style>
  .steps {
    margin-top: 0;
  }

  .steps p {
    margin: 0;
  }

  .steps p:last-child {
    color: rgba(30, 30, 67, 0.4);
  }
</style>
