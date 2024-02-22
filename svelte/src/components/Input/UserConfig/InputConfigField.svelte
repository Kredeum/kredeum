<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { bounceOut } from "svelte/easing";

  export let key = "";
  export let value = "";
  export let error = "";

  $: isError = error ? "field-error" : "";
</script>

<div class="kre-congif-field {isError}">
  <span>{key}</span>
  <input type="text" class="kre-field-outline" placeholder="Enter value" bind:value />
  {#if error}
    <p
      in:fly={{ delay: 0, duration: 300, x: -100, y: 0, opacity: 0.5, easing: bounceOut }}
      out:fade={{ duration: 100 }}
    >
      {error}
    </p>
  {/if}
</div>

<style>
  .kre-congif-field {
    display: grid;
    grid-template-columns: 6em 1fr;
    grid-template-rows: auto 2em;
    gap: 0px 1em;
    align-items: center;
    justify-items: right;
    line-break: anywhere;
  }

  .kre-congif-field:not(.field-error) input:focus {
    border: 1px solid #d0d3da;
  }

  .kre-congif-field p {
    grid-column: 1 / 3;
    margin: 0;
    text-align: right;
  }

  .field-error input {
    border: 1px solid red;
  }

  .field-error p {
    color: red;
  }
</style>
