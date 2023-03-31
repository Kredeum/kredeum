<script lang="ts">
  import { getCurrency, isNumeric } from "@lib/common/config";
  import { ZeroAddress, formatEther, parseEther } from "ethers";

  /////////////////////////////////////////////////
  //  <InputPrice {chainId} {price} {inputError}? />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let price: bigint = 0n;
  export let inputError = "";
  /////////////////////////////////////////////////

  let inputPrice = price > 0n ? formatEther(price) : "0.0";

  $: inputPrice && handleInputPrice();
  const handleInputPrice = () => {
    let tmpPrice = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do tmpPrice = tmpPrice.slice(0, -1);
    while (tmpPrice.split(".")[1]?.length > 18);

    inputPrice = isNumeric(tmpPrice) ? tmpPrice : "0.0";
    price = parseEther(inputPrice);
  };
</script>

<div class="kre-input-container" data-currency-symbol={getCurrency(chainId)}>
  <input
    type="text"
    bind:value={inputPrice}
    class="kre-field-outline"
    id="set-price-nft"
    placeholder={inputPrice}
    style={`--input-padding:${getCurrency(chainId).length};`}
  />
</div>

{#if inputError}
  <span class="c-red"><i class="fas fa-exclamation-triangle fa-left c-red" /> {inputError}</span>
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
