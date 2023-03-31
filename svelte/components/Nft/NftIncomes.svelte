<script lang="ts">
  import type {} from "ethers";
  import { formatEther } from "ethers";

  import type { NftType } from "@lib/common/types";
  import { config, getCurrency } from "@lib/common/config";
  import { feeAmount } from "@helpers/collection";

  import { nftChainId, nftOwner, nftRoyaltyFee, nftRoyaltyAccount, nftRoyaltyMinimum } from "@helpers/nft";
  import { displayEther } from "@helpers/common";

  //////////////////////////////////////////////////////////////////////////
  //  <NftIncomes {nft} {price} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////////////////////////
  export let nft: NftType;
  export let price: bigint = undefined;
  //////////////////////////////////////////////////////////////////////////

  const treasuryFee = config.treasury.fee;

  const currency: string = getCurrency(nftChainId(nft));
  const royaltyFee = nftRoyaltyFee(nft);
  const royaltyAccount = nftRoyaltyAccount(nft);
  const royaltyMinimum = nftRoyaltyMinimum(nft);
  const owner = nftOwner(nft);

  let sellerAmount = 0n;
  let receiverFeeAmount = 0n;
  let treasuryFeeAmount = 0n;
  let minimum = false;

  $: price, handlePrice();
  $: chainId = nftChainId(nft);

  const handlePrice = () => {
    price ||= nft?.price || 0n;
    treasuryFeeAmount = feeAmount(price, treasuryFee);
    receiverFeeAmount = feeAmount(price, royaltyFee);

    minimum = royaltyMinimum > receiverFeeAmount + treasuryFeeAmount;
    if (minimum) receiverFeeAmount = royaltyMinimum;

    sellerAmount = price - (receiverFeeAmount + treasuryFeeAmount);
  };

  $: console.info(
    "<NftIncomes",
    displayEther(chainId, sellerAmount),
    displayEther(chainId, receiverFeeAmount),
    displayEther(chainId, treasuryFeeAmount),
    price,
    nft
  );
</script>

<div>
  <span class="label">Price of {displayEther(chainId, price)} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={sellerAmount < 0 ? "c-red" : ""}>
          {displayEther(chainId, sellerAmount)} to seller
        </p>
        <p>{owner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {displayEther(chainId, receiverFeeAmount)} Royalty to receiver
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
          {displayEther(chainId, treasuryFeeAmount)} fee to protocol ({treasuryFee / 100} %)
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
