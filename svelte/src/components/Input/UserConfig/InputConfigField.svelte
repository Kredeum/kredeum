<script lang="ts">
  export let key = "";
  export let value = "";
</script>

<div class="kre-section-small">
  <span>{key}</span>

  <input type="text" class="kre-field-outline" placeholder="Enter value" bind:value />
</div>

<style>
  .kre-section-small {
    display: flex;
    gap: 5px;
    align-items: center;
  }
</style>
