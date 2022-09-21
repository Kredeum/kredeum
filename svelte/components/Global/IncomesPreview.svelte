<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { onMount } from "svelte";

  import { config, getCurrency } from "@lib/common/kconfig";

  export let nft: NftType;
  export let price: BigNumber = null;

  let sellerIncome: BigNumber = BigNumber.from(0);
  let receiverFeeAmount: BigNumber = BigNumber.from(0);
  let kredeumFeeAmount: BigNumber = BigNumber.from(0);

  $: price && handleSellIncomes();
  const handleSellIncomes = () => {
    kredeumFeeAmount = price.mul(config.treasury.fee).div(10000);
    receiverFeeAmount = price.mul(nft.royaltyFee).div(10000);
    sellerIncome = price.sub(kredeumFeeAmount.add(receiverFeeAmount));
  };

  onMount(() => {
    if (!price) price = nft.price;
    handleSellIncomes();
  });
</script>

<div class="section">
  <span class="label">Price splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p>
          {utils.formatEther(sellerIncome)}
          {getCurrency(nft.chainId)} to seller
        </p>
        <p>{nft.owner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {utils.formatEther(receiverFeeAmount)}
          {getCurrency(nft.chainId)} ({Number(nft.royaltyFee) / 100} %) royalties to creator
        </p>
        <p>{nft.royaltyAccount}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {utils.formatEther(kredeumFeeAmount)}
          {getCurrency(nft.chainId)} ({config.treasury.fee / 100} %) fees
        </p>
        <p>Send to your obliged Kredeum Nfts Factory :)</p>
      </div>
    </li>
  </ul>
</div>

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
