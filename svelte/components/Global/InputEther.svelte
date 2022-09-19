<script lang="ts">
  import { utils } from "ethers";

  import { getNetwork } from "@lib/common/kconfig";

  /////////////////////////////////////////////////
  //  <InputEther {input} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  // export let etherParsed = "";
  export let chainId: number;
  export let inputPrice = "";
  export let nftPrice = "0";

  let inputError: string;

  $: if (inputPrice) {
    let price = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do price = price.slice(0, -1);
    while (price.split(".")[1]?.length > 18);

    inputPrice = price;
  }

  $: if (nftPrice) {
    inputPrice = nftPrice;
  }
</script>

<div class="kre-input-container" data-currency-symbol={getNetwork(chainId).nativeCurrency.symbol}>
  <input
    type="text"
    bind:value={inputPrice}
    class="kre-field-outline"
    id="set-price-nft"
    placeholder={utils.formatEther(nftPrice)}
    style={`--input-padding:${getNetwork(chainId).nativeCurrency.symbol.length};`}
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
