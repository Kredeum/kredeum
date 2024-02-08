<script>
  import { clickOutside } from "@helpers/clickOutside";
  import { fade, fly } from "svelte/transition";
  import { quintOut, bounceOut } from "svelte/easing";

  import { metamaskChainId } from "@stores/metamask";
  import { isAddress } from "@lib/common/config";
  import { collectionStoreAndRefresh } from "@stores/collection/collection";

  let collectionAddress = "";

  let errorMessage = "";
  let successMessage = "";

  const resetMessages = () => {
    errorMessage = "";
    successMessage = "";
  };

  const resolverAddCollection = () => {
    if (isAddress(collectionAddress)) {
      collectionStoreAndRefresh($metamaskChainId, collectionAddress);
      console.log("Collection added: ", collectionAddress);
      successMessage = `Collection imported: ${collectionAddress}`;
      collectionAddress = "";
    } else {
      errorMessage = "bad collection address";
    }
  };
</script>

<div use:clickOutside={resetMessages}>
  <div class="titre add-collection-address">Add custom collection</div>
  <div class="form-field">
    <input
      type="text"
      class=" kre-field-outline"
      placeholder="Import collection address"
      bind:value={collectionAddress}
      on:input={resetMessages}
    />
    <button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={resolverAddCollection}>Add</button>
  </div>
  <p>
    {#if errorMessage}
      <span
        class="error-message"
        in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: bounceOut }}
        out:fade={{ duration: 300 }}
      >
        Ooops, {errorMessage}
      </span>
    {:else if successMessage}
      <span
        class="success-message"
        in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: quintOut }}
        out:fade={{ duration: 300 }}
      >
        {successMessage}
      </span>
    {/if}
  </p>
</div>

<style>
  .form-field {
    display: grid;
    grid-template-columns: auto min-content;
  }

  p span {
    display: block;
  }

  .error-message {
    color: red;
  }

  .success-message {
    color: #3acf6e;
  }
</style>
