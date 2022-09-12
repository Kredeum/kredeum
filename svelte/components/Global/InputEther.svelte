<script lang="ts">
  import { ethers } from "ethers";

  /////////////////////////////////////////////////
  //  <InputEther {input} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let etherParsed = "";

  let inputError: string;
  let setPriceInput: string;

  $: setPriceInput && handlePrice();
  const handlePrice = () => {
    setPriceInput = setPriceInput.replace(/[^0-9.,]/g, "");
    let formatedInputPrice = setPriceInput.replace(/[,]/g, ".");
    const decimals = formatedInputPrice.split(".")[1];
    if (decimals?.length > 18) {
      setPriceInput = setPriceInput.slice(0, -1);
      formatedInputPrice = formatedInputPrice.slice(0, -1);
    }

    if (setPriceInput) etherParsed = ethers.utils.parseEther(formatedInputPrice).toString();
  };
</script>

<input type="text" bind:value={setPriceInput} id="set-price-nft" /> Eth
{#if inputError}
  <span class="c-red">Please enter a valid price</span>
{/if}
