<script lang="ts">
  import { BigNumber, BigNumberish, constants, utils } from "ethers";
  const { formatEther } = utils;
  import { onMount } from "svelte";

  import { ReceiverType } from "@lib/common/ktypes";
  import { config, getCurrency } from "@lib/common/kconfig";
  import { getMax, getReceiverAmount } from "@lib/nft/kautomarket";

  //////////////////////////////////////////////////////////////////////////
  //  <IncomesPreview {chainId} {nftOwner} {nftPrice} {nftRoyalty} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let nftOwner: string;
  export let nftPrice: BigNumber;
  export let nftRoyalty: ReceiverType;
  //////////////////////////////////////////////////////////////////////////

  let currency: string = getCurrency(chainId);
  let minimum: boolean = false;

  let sellerAmount: BigNumber = constants.Zero;
  let receiverFeeAmount: BigNumber = constants.Zero;
  let treasuryFeeAmount: BigNumber = constants.Zero;

  const displayEther = (price: BigNumberish): string => `${formatEther(price)} ${currency}`;

  $: handleCalculation(nftPrice);
  const handleCalculation = (price: BigNumberish): void => {
    const nftRoyaltyMinimum = BigNumber.from(nftRoyalty?.minimum || 0);

    treasuryFeeAmount = getReceiverAmount(price, config.treasury.fee);
    receiverFeeAmount = getReceiverAmount(price, nftRoyalty.fee);

    minimum = nftRoyaltyMinimum.gt(receiverFeeAmount.add(treasuryFeeAmount));
    if (minimum) {
      receiverFeeAmount = nftRoyaltyMinimum;
    }

    sellerAmount = nftPrice.sub(receiverFeeAmount.add(treasuryFeeAmount));
  };

  $: console.log("IncomesPreview ~ nftRoyalty", nftRoyalty);
</script>

<div>
  <span class="label">Price of {displayEther(nftPrice)} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={sellerAmount.lt(0) ? "c-red" : ""}>
          {displayEther(sellerAmount)} to seller
        </p>
        <p>{nftOwner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(receiverFeeAmount)} royalty to receiver
          {#if minimum}
            (minimum royalty)
          {:else}
            ({nftRoyalty.fee / 100} %)
          {/if}
        </p>
        <p>{nftRoyalty.account}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(treasuryFeeAmount)} fee to protocol ({config.treasury.fee / 100} %)
        </p>
        <p />
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
