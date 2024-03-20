<script lang="ts">
  import { ADDRESS_ZERO, isAddressNotZero } from "@common/common/config";
  import { onMount } from "svelte";
  import { Address } from "viem";

  /////////////////////////////////////////////////
  // <ButtonOwner {account} bind:{owner} />
  // Select All button
  /////////////////////////////////////////////////
  export let account: Address;
  export let owner: Address;
  /////////////////////////////////////////////////

  const toggleOwner = () =>
    (owner = isAddressNotZero(owner) ? ADDRESS_ZERO : isAddressNotZero(account) ? account : ADDRESS_ZERO);

  onMount(toggleOwner);
</script>

<button
  class="clear"
  on:click={toggleOwner}
  title="      {isAddressNotZero(owner) ? 'Click to View All NFTs' : 'Click to View My NFTs'}"
>
  <i class="fas fa-{isAddressNotZero(owner) ? 'users' : 'user'}" />
</button>
