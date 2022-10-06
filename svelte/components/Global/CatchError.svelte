<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { clickOutside } from "@helpers/clickOutside";
  import { fade } from "svelte/transition";

  ///////////////////////////////////////////////////////////
  // <CollectionCreate {chainId} {collection} />
  // Catch error and display it in modal
  ///////////////////////////////////////////////////////////

  // Context for catchError component
  ///////////////////////////////////////////////////////////
  let catchError: Writable<string> = getContext("catchError");
  ///////////////////////////////////////////////////////////

  // export let catchError: string;

  // let error = "";

  // $: error = catchError;
</script>

{#if $catchError}
  <div id="kre-catch-error" class="modal-window" transition:fade>
    <div use:clickOutside={() => ($catchError = "")}>
      <div class="modal-content">
        <span on:click={() => ($catchError = "")} title="Close" class="modal-close"><i class="fa fa-times" /></span>

        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-plus fa-left c-green" />Ooops ! something went wrong...
          </div>
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> Error : {$catchError}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-window {
    visibility: visible;
    opacity: 1;
    z-index: 1001;
    pointer-events: auto;
  }
</style>
