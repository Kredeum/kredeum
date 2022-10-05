<script lang="ts">
  import { clickOutside } from "@helpers/clickOutside";
  import { fade } from "svelte/transition";

  ///////////////////////////////////////////////////////////
  // <CollectionCreate {chainId} {collection} />
  // Catch error and display it in modal
  ///////////////////////////////////////////////////////////

  export let error: string;
</script>

{#if error}
  <div id="kre-catch-error" class="modal-window" transition:fade>
    <div use:clickOutside={() => (error = "")}>
      <div id="kredeum-create-nft">
        <div class="modal-content">
          <span on:click={() => (error = "")} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div class="titre">
              <i class="fas fa-plus fa-left c-green" />Ooops ! something went wrong...
            </div>
            <div class="section">
              <div class="form-field kre-warning-msg">
                <p>
                  <i class="fas fa-exclamation-triangle fa-left c-red" /> Error : {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
