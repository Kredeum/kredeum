<script lang="ts">
  import { isAddressNotZero } from "@kredeum/common/lib/common/config";
  import { onMount } from "svelte";

  /////////////////////////////////////////////////
  // <ButtonOwner bind:{owner} />
  // Select All button
  /////////////////////////////////////////////////
  export let account: string;
  export let owner: string;
  /////////////////////////////////////////////////

  const toggleOwner = () => (owner = isAddressNotZero(owner) ? null : isAddressNotZero(account) ? account : null);

  onMount(toggleOwner);
</script>

<button class="clear" on:click={toggleOwner} title="      {owner ? 'Click to View All NFTs' : 'Click to View My NFTs'}">
  <i class="fas fa-{owner ? 'users' : 'user'}" />
</button>
