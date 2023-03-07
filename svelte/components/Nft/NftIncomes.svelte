<script lang="ts">
  import type { BigNumberish } from "ethers";
  import { BigNumber, constants, utils } from "ethers";
  const { formatEther } = utils;

  import type { NftType, ReceiverType } from "@lib/common/types";
  import { config, getCurrency } from "@lib/common/config";
  import { getReceiverAmount } from "@lib/nft/nft-automarket-get";

  import { nftChainId, nftOwner, nftPrice, nftRoyaltyFee, nftRoyaltyAccount, nftRoyaltyMinimum } from "@helpers/nft";
  import { onMount } from "svelte";

  //////////////////////////////////////////////////////////////////////////
  //  <NftIncomes {nft} {price} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////////////////////////
  export let nft: NftType;
  export let price: BigNumber = undefined;
  //////////////////////////////////////////////////////////////////////////

  const treasuryFee = config.treasury.fee;

  const currency: string = getCurrency(nftChainId(nft));
  const royaltyFee = nftRoyaltyFee(nft);
  const royaltyAccount = nftRoyaltyAccount(nft);
  const royaltyMinimum = nftRoyaltyMinimum(nft);
  const owner = nftOwner(nft);

  let sellerAmount = BigNumber.from(0);
  let receiverFeeAmount = BigNumber.from(0);
  let treasuryFeeAmount = BigNumber.from(0);
  let minimum = false;

  $: price, handlePrice();

  const handlePrice = () => {
    // price == sellerAmount + receiverFeeAmount + treasuryFeeAmount
    if (price == undefined) price = nft.price;

    treasuryFeeAmount = getReceiverAmount(price, treasuryFee);
    receiverFeeAmount = getReceiverAmount(price, royaltyFee);

    minimum = royaltyMinimum.gt(receiverFeeAmount.add(treasuryFeeAmount));
    if (minimum) receiverFeeAmount = royaltyMinimum;

    sellerAmount = price.sub(receiverFeeAmount).sub(treasuryFeeAmount);
  };

  const displayEther = (wei: BigNumberish): string => `${formatEther(wei)} ${currency}`;
  $: console.info(
    "<NftIncomes",
    displayEther(sellerAmount),
    displayEther(receiverFeeAmount),
    displayEther(treasuryFeeAmount),
    price,
    nft
  );
</script>

<div>
  <span class="label">Price of {displayEther(price)} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={sellerAmount.lt(0) ? "c-red" : ""}>
          {displayEther(sellerAmount)} to seller
        </p>
        <p>{owner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(receiverFeeAmount)} Royalty to receiver
          {#if minimum}
            (minimum royalty)
          {:else}
            ({royaltyFee / 100} %)
          {/if}
        </p>
        <p>{royaltyAccount}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(treasuryFeeAmount)} fee to protocol ({treasuryFee / 100} %)
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
