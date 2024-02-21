<script lang="ts">
  export let key = "";
  export let value = "";
  export let error = "";

  $: isError = error ? "field-error" : "";
</script>

<div class="kre-congif-field {isError}">
  <!-- <div class="kre-section-small"> -->
  <span>{key}</span>

  <input type="text" class="kre-field-outline" placeholder="Enter value" bind:value />
  <!-- </div> -->
  <p>{error || ""}</p>
</div>

<style>
  .kre-congif-field {
    display: grid;
  }

  /* .kre-section-small {
    display: flex;
    gap: 20px;
    align-items: center;
  } */

  .field-error input {
    border: 1px solid red;
  }

  .field-error p {
    color: red;
  }
</style>
