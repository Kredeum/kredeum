<script lang="ts">
  import { ReceiverType } from "@lib/common/ktypes";

  import { BigNumber, constants, utils } from "ethers";

  import { config, getCurrency, MAX_FEE } from "@lib/common/kconfig";
  import { bigNumberMax } from "@lib/nft/kautomarket";

  //////////////////////////////////////////////////////
  //  <IncomesPreview {chainId} {nftOwner} {nftPrice} {nftRoyalty} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////
  export let chainId: number;
  export let nftOwner: string;
  export let nftPrice: BigNumber;
  export let nftRoyalty: ReceiverType;
  //////////////////////////////////////////////////////

  let currency: string = getCurrency(chainId);
  let sellerIncome: BigNumber = constants.Zero;
  let receiverFeeAmount: BigNumber = constants.Zero;
  let kredeumFeeAmount: BigNumber = constants.Zero;

  $: if (nftPrice) {
    kredeumFeeAmount = nftPrice.mul(config.treasury.fee).div(10000);

    if (nftRoyalty.fee)
      receiverFeeAmount = bigNumberMax(
        nftPrice.mul(nftRoyalty.fee).div(MAX_FEE),
        nftRoyalty.minimum || BigNumber.from(0)
      );

    sellerIncome = nftPrice.sub(kredeumFeeAmount.add(receiverFeeAmount));
  }
</script>

<div>
  <span class="label">Price of {utils.formatEther(nftPrice || 0)} {currency} splitted as follows</span>
  <ul class="steps">
    <li>
      <div>
        <p class={constants.Zero.gt(sellerIncome) ? "c-red" : ""}>
          {utils.formatEther(sellerIncome || 0)}
          {currency} to seller
        </p>
        <p>{nftOwner}</p>
      </div>
    </li>
    <li>
      <div>
        <p>
          {utils.formatEther(receiverFeeAmount || 0)}
          {currency} royalties to creator
          {#if constants.Zero.lt(nftRoyalty.minimum || BigNumber.from(0))}
            ( min {utils.formatEther(nftRoyalty.minimum || 0)} {currency} )
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
          {utils.formatEther(kredeumFeeAmount || 0)}
          {currency} ({config.treasury.fee / 100} %) fees to Kredeum protocol
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
