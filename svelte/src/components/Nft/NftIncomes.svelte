<script lang="ts">
  import type { NftType } from "@common/common/types";
  import { treasuryFee, displayEther, feeAmount } from "@common/common/config";

  import { nftChainId, nftOwner, nftRoyaltyFee, nftRoyaltyAccount, nftRoyaltyMinimum, nftPrice } from "@common/nft/nft";

  //////////////////////////////////////////////////////////////////////////
  //  <NftIncomes {nft} {priceInput} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////////////////////////
  export let nft: NftType;
  export let priceInput: bigint | undefined = undefined;
  //////////////////////////////////////////////////////////////////////////

  $: chainId = nftChainId(nft);

  let sellerAmount = 0n;
  let receiverFeeAmount = 0n;
  let treasuryFeeAmount = 0n;
  let minimum = false;
  let price = 0n;

  $: priceInput, nft && handlePrice();
  const handlePrice = () => {
    price = priceInput == null ? nftPrice(nft) : priceInput;

    treasuryFeeAmount = feeAmount(price, treasuryFee());
    receiverFeeAmount = feeAmount(price, nftRoyaltyFee(nft));

    minimum = nftRoyaltyMinimum(nft) > receiverFeeAmount + treasuryFeeAmount;
    if (minimum) receiverFeeAmount = nftRoyaltyMinimum(nft);

    sellerAmount = price - (receiverFeeAmount + treasuryFeeAmount);
  };
</script>

<div>
  <span class="label">Price of {displayEther(chainId, price)} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={sellerAmount < 0 ? "c-red" : ""}>
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
            ({nftRoyaltyFee(nft) / 100n} %)
          {/if}
        </p>
        <p>{nftRoyaltyAccount(nft)}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(chainId, treasuryFeeAmount)} fee to protocol ({treasuryFee() / 100n} %)
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
