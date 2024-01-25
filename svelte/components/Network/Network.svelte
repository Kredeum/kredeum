<script lang="ts">
  import { networks } from "@lib/common/networks";

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <Network {chainId} {txt} />
  // Display Network
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let txt = false;
  export let pre = false;
  /////////////////////////////////////////////////////////////////////////////////////////
  // Capitalize first letter
  const strUpFirst = (str: string | undefined): string =>
    str && str.length >= 1 ? str.charAt(0).toUpperCase() + str.substring(1) : "";

  $: chainName = networks.getChainName(chainId);
  $: iconName = networks.getIconName(chainId);
  $: chainLabel = strUpFirst(chainName);
  $: preLabel = pre ? (networks.isLayer2(chainId) ? "L2 " : "") : "";

  $: logoPos = pre ? (networks.isLayer2(chainId) ? 25 : 0) : 0;

  $: logoStyle = `background: url("./assets/images/${iconName}") no-repeat ${logoPos}px center/25px; padding: 5px 0;`;
  $: spacerStyle = `margin-left: 35px;`;

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

{#if txt}
  {preLabel}{chainLabel}
{:else}
  <span style={logoStyle}>
    {preLabel}
    <span style={spacerStyle}>{chainLabel}</span>
  </span>
{/if}
