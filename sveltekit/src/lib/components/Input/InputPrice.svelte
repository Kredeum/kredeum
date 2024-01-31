<script lang="ts">
  import { isNumeric } from "@kredeum/common/lib/common/config";
  import { networks } from "@kredeum/common/lib/common/networks";
  import { BigNumber, constants, utils } from "ethers";
  import { formatEther } from "ethers/lib/utils";

  /////////////////////////////////////////////////
  //  <InputPrice {chainId} {price} {error}? />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let price: BigNumber = constants.Zero;
  export let error = "";
  /////////////////////////////////////////////////

  let inputPrice = "0.0";

  // set inputPrice on price change
  $: price && handlePrice();
  const handlePrice = () => {
    inputPrice = price.gt(0) ? formatEther(price) : "0.0";
  };

  // handle inputPrice on input change
  $: inputPrice && handleInputPrice();
  const handleInputPrice = () => {
    // console.log("handleInputPrice", inputPrice);
    let tmpPrice = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do tmpPrice = tmpPrice.slice(0, -1);
    while (tmpPrice.split(".")[1]?.length > 18);

    inputPrice = isNumeric(tmpPrice) ? tmpPrice : "0.0";
    price = utils.parseEther(inputPrice);
  };

  // $: console.log("<InputPrice", String(price), String(inputPrice));
</script>

<div class="kre-input-container" data-currency-symbol={networks.getCurrency(chainId)}>
  <input
    type="text"
    bind:value={inputPrice}
    class="kre-field-outline"
    id="set-price-nft"
    placeholder={inputPrice}
    style={`--input-padding:${networks.getCurrency(chainId).length};`}
  />
</div>

{#if error}
  <span class="c-red"><i class="fas fa-exclamation-triangle fa-left c-red" /> {error}</span>
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
