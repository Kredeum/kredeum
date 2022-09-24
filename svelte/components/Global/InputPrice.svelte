<script lang="ts">
  import { getCurrency } from "@lib/common/kconfig";
  import { BigNumber, utils } from "ethers";
  import { formatEther } from "ethers/lib/utils";
  import { onMount } from "svelte";

  /////////////////////////////////////////////////
  //  <InputPrice {chainId} {price} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let price: BigNumber = BigNumber.from(0);
  /////////////////////////////////////////////////

  let inputError: string;
  let inputPrice: string;

  $: if (inputPrice) {
    let tmpPrice = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do tmpPrice = tmpPrice.slice(0, -1);
    while (tmpPrice.split(".")[1]?.length > 18);

    inputPrice = tmpPrice;
    price = utils.parseEther(inputPrice);
  }

  onMount(() => {
    console.log("onMount ~ price", price);
    inputPrice = formatEther(price);
    console.log("onMount ~ inputPrice", inputPrice);
  });
</script>

<div class="kre-input-container" data-currency-symbol={getCurrency(chainId)}>
  <input
    type="text"
    bind:value={inputPrice}
    class="kre-field-outline"
    id="set-price-nft"
    placeholder={inputPrice || "0"}
    style={`--input-padding:${getCurrency(chainId).length};`}
  />
</div>

{#if inputError}
  <span class="c-red">Please enter a valid price</span>
{/if}

<style>
  .kre-input-container {
    position: relative;
  }
  .kre-input-container::before {
    content: attr(data-currency-symbol);
    color: #1e1e43;
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
  }

  .kre-input-container input {
    padding-right: calc((var(--input-padding) * 10px) + 40px);
  }
</style>
