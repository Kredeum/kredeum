<script lang="ts">
  export let owner;
  export let notInstalled;
</script>

{#if owner}
  <slot name="owner" />
{:else if notInstalled}
  <slot name="noinstall" />
{:else}
  <slot name="link" />
{/if}
