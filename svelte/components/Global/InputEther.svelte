<script lang="ts">
  import { getCurrency } from "@lib/common/kconfig";

  /////////////////////////////////////////////////
  //  <InputEther {chainId} {input} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let inputPrice = "";
  /////////////////////////////////////////////////

  let inputError: string;

  $: if (inputPrice) {
    let price = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do price = price.slice(0, -1);
    while (price.split(".")[1]?.length > 18);

    inputPrice = price;
  }
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
