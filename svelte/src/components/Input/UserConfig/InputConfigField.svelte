<script lang="ts">
  export let key = "";
  export let value = "";
  export let error = "";

  $: isError = error ? "field-error" : "";
</script>

<div class={isError}>
  <div class="kre-section-small">
    <span>{key}</span>

    <input type="text" class="kre-field-outline" placeholder="Enter value" bind:value /><br />
  </div>
  <p>{error}</p>
</div>

<style>
  .kre-section-small {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .field-error input {
    border: 1px solid red;
  }

  .field-error p {
    color: red;
  }
</style>
