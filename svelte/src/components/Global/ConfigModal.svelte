<script lang="ts">
  import { clickOutside } from "../../helpers/clickOutside";
  import { fade } from "svelte/transition";
  import InputConfigSections from "../Input/UserConfig/InputConfigSections.svelte";

  let open = false;
  const toggle = () => (open = !open);
</script>

<button class="kre-nav-button" on:click|preventDefault={toggle} on:keydown={toggle}>
  <i class="fa fa-cog" aria-hidden="true" /><br />
  config
</button>

{#if open}
  <!-- Modal Config -->
  <div class="modal-window" transition:fade>
    <div class="modal-content" use:clickOutside={() => (open = false)} transition:fade>
      <span on:click={toggle} on:keydown={toggle} title="Close" class="btn modal-close" role="button" tabindex="0"
        ><i class="fa fa-times" /></span
      >

      <div class="modal-body">
        <InputConfigSections bind:open />
      </div>
    </div>
  </div>
{/if}

<style>
  button.kre-nav-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .modal-window {
    visibility: visible;
    opacity: 1;
    z-index: 1000;
    color: #1e1e43;
    pointer-events: auto;
  }

  .modal-window > div {
    max-width: 940px;
  }

  .modal-content {
    min-height: 360px;
  }

  .modal-body {
    text-align: left;
    overflow-y: auto;
  }
</style>
