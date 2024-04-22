<script lang="ts">
  import { networks } from "@kredeum/common/src/common/networks";

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <Network {chainId} {txt} />
  // Display Network
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let txt = false;
  export let pre = false;
  /////////////////////////////////////////////////////////////////////////////////////////

  $: chainLabel = networks.getChainLabel(chainId);
  $: chainMainnet = networks.getMainnetName(chainId);
  $: preLabel = pre ? (networks.isLayer2(chainId) ? "L2 " : "") : "";

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

{#if txt}
  {preLabel} {chainLabel}
{:else}
  <span class="line">
    {#if preLabel}
      <span class="prelabel">{preLabel}</span>
    {/if}
    <span class="icon icon-{chainMainnet}" />
    <span>{chainLabel}</span>
  </span>
{/if}

<style>
  span.line {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }
  span.prelabel {
    margin-right: 8px;
  }
  span.icon {
    /* display: inline-block; */
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
</style>
