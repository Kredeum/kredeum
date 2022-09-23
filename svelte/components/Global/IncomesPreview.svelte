<script lang="ts">
  import { Readable } from "svelte/store";
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { nftStore } from "@stores/nft/nft";
  import { onMount } from "svelte";

  import { metamaskChainId } from "@main/metamask";
  import { config, getCurrency } from "@lib/common/kconfig";

  //////////////////////////////////////////////////////
  //  <IncomesPreview {nft} {price} />
  // Display NFT Price prepartion according to it price
  //////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let price: BigNumber = null;
  //////////////////////////////////////////////////////

  let nft: Readable<NftType>;

  let sellerIncome: BigNumber = BigNumber.from(0);
  let receiverFeeAmount: BigNumber = BigNumber.from(0);
  let kredeumFeeAmount: BigNumber = BigNumber.from(0);

  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: chainId && address && tokenID && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
    if (!$nft.collection?.supports) {
      await nftStore.refreshSubList(chainId, address, $nft.owner);
    }

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: price && handleSellIncomes();
  const handleSellIncomes = () => {
    kredeumFeeAmount = price?.mul(config.treasury.fee).div(10000) || BigNumber.from(0);
    if ($nft?.royaltyFee) receiverFeeAmount = price?.mul($nft.royaltyFee).div(10000) || BigNumber.from(0);
    sellerIncome = price?.sub(kredeumFeeAmount.add(receiverFeeAmount)) || BigNumber.from(0);
  };

  onMount(() => {
    if (!price) price = $nft.price;
    handleSellIncomes();
  });
</script>

{#if $nft}
  <div class="section">
    <span class="label">Price splitted as follows</span>
    <ul class="steps">
      <li>
        <div>
          <p>
            {utils.formatEther(sellerIncome || 0)}
            {getCurrency(chainId)} to seller
          </p>
          <p>{$nft.owner}</p>
        </div>
      </li>
      <li>
        <div>
          <p>
            {utils.formatEther(receiverFeeAmount || 0)}
            {getCurrency(chainId)} ({$nft.royaltyFee / 100} %) royalties to creator
          </p>
          <p>{$nft.royaltyAccount}</p>
        </div>
      </li>
      <li>
        <div>
          <p>
            {utils.formatEther(kredeumFeeAmount || 0)}
            {getCurrency(chainId)} ({config.treasury.fee / 100} %) fees to Kredeum protocol
          </p>
          <p />
        </div>
      </li>
    </ul>
  </div>
{/if}

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
