<script lang="ts">
  import type { BigNumberish } from "ethers";
  import { BigNumber, utils } from "ethers";
  const { formatEther } = utils;

  import type { NftType } from "@lib/common/types";
  import { treasuryFee, displayEther, getCurrency, feeAmount } from "@lib/common/config";

  import { nftChainId, nftOwner, nftRoyaltyFee, nftRoyaltyAccount, nftRoyaltyMinimum, nftPrice } from "@lib/nft/nft";

  //////////////////////////////////////////////////////////////////////////
  //  <NftIncomes {nft} {priceInput} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////////////////////////
  export let nft: NftType;
  export let priceInput = null;
  //////////////////////////////////////////////////////////////////////////

  $: chainId = nftChainId(nft);

  let sellerAmount = BigNumber.from(0);
  let receiverFeeAmount = BigNumber.from(0);
  let treasuryFeeAmount = BigNumber.from(0);
  let minimum = false;
  let price = BigNumber.from(0);

  $: priceInput, nft && handlePrice();
  const handlePrice = () => {
    price = priceInput == null ? nftPrice(nft) : priceInput;

    treasuryFeeAmount = feeAmount(price, treasuryFee());
    receiverFeeAmount = feeAmount(price, nftRoyaltyFee(nft));

    minimum = nftRoyaltyMinimum(nft).gt(receiverFeeAmount.add(treasuryFeeAmount));
    if (minimum) receiverFeeAmount = nftRoyaltyMinimum(nft);

    sellerAmount = price.sub(receiverFeeAmount).sub(treasuryFeeAmount);
  };
</script>

<div>
  <span class="label">Price of {displayEther(chainId, price)} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={sellerAmount.lt(0) ? "c-red" : ""}>
          {displayEther(chainId, sellerAmount)} to seller
        </p>
        <p>{nftOwner(nft)}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(chainId, receiverFeeAmount)} Royalty to receiver
          {#if minimum}
            (minimum royalty)
          {:else}
            ({nftRoyaltyFee(nft) / 100} %)
          {/if}
        </p>
        <p>{nftRoyaltyAccount(nft)}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(chainId, treasuryFeeAmount)} fee to protocol ({treasuryFee() / 100} %)
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
