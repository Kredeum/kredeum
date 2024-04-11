<script lang="ts">
  import { ADDRESS_ZERO, getChecksumAddress, isAddressOk } from "@kredeum/common/src/common/config";

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

    if (isAddressOk(tmpEthAddress)) tmpEthAddress = getChecksumAddress(tmpEthAddress);

    ethAddress = tmpEthAddress != ADDRESS_ZERO ? tmpEthAddress : ADDRESS_ZERO;
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
