<script>
  import { fade, fly } from "svelte/transition";
  import { quintOut, bounceOut } from "svelte/easing";

  import { clickOutside } from "../../helpers/clickOutside";
  import { metamaskChainId, metamaskSignerAddress } from "../../stores/metamask";
  import { getDappUrl, isAddressNotZero } from "@kredeum/common/src/common/config";
  import { collectionStore, collectionStoreRefresh } from "../../stores/collection/collection";

  let collectionAddress = "";

  let errorMessage = "";
  let successMessage = "";

  const resetMessages = () => {
    errorMessage = "";
    successMessage = "";
  };

  const resolverAddCollection = async () => {
    if (!isAddressNotZero(collectionAddress)) {
      errorMessage = "Invalid Address";
      return;
    }

    try {
      collectionStore($metamaskChainId, collectionAddress);
      await collectionStoreRefresh($metamaskChainId, collectionAddress, $metamaskSignerAddress);
      console.info("Collection added: ", collectionAddress);
      successMessage = `Collection imported: ${collectionAddress}`;

      const url = getDappUrl($metamaskChainId, { address: collectionAddress });
      console.log("resolverAddCollection ~ url:", url);
      // collectionAddress = "";
      location.href = url;
      location.reload();
    } catch (err) {
      errorMessage = "Invalid Collection";
    }
  };
</script>

<div use:clickOutside={resetMessages}>
  <div class="form-field">
    <input
      type="text"
      class=" kre-field-outline"
      placeholder="Collection Address"
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
        {errorMessage}
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
