<script lang="ts">
  import { getChecksumAddress } from "@lib/common/config";
  import { ZeroAddress, isAddress } from "ethers";

  /////////////////////////////////////////////////
  //  <InputEthAddress {ethAddress} {placeholder} {inputError}? />
  // Input fields for Ethereum account address
  /////////////////////////////////////////////////
  export let ethAddress = "";
  export let placeholder = "";
  export let inputError = "";
  /////////////////////////////////////////////////

  $: ethAddress && handleInputEthAddress();
  const handleInputEthAddress = () => {
    let tmpEthAddress = ethAddress.replace(/[^x0-9A-Fa-f]/gi, "");

    if (isAddress(tmpEthAddress)) tmpEthAddress = getChecksumAddress(tmpEthAddress);

    ethAddress = tmpEthAddress != ZeroAddress ? tmpEthAddress : ZeroAddress;
  };
</script>

<div>
  <input type="text" class="kre-field-outline" {placeholder} bind:value={ethAddress} id="input-eth-address" />
</div>

{#if inputError}
  <span class="c-red"><i class="fas fa-exclamation-triangle fa-left c-red" /> {inputError}</span>
{/if}

<style>
</style>
