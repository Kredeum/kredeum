<script lang="ts">
  import { getChainName, getLinkedLayer1, getLinkedMainnet, isLayer1, isLayer2, isTestnet } from "@lib/common/config";

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <Network {chainId} {txt} />
  // Display Network
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let txt = false;
  export let pre = false;
  /////////////////////////////////////////////////////////////////////////////////////////
  // Capitalize first letter
  const strUpFirst = (str: string): string => (str.length >= 1 ? str.charAt(0).toUpperCase() + str.substring(1) : "");

  $: chainName = getChainName(chainId);
  $: mainnetName = isTestnet(chainId) ? getChainName(getLinkedMainnet(chainId)) : chainName;
  $: chainLabel =  strUpFirst(chainName);
  $: preLabel = pre ? (isLayer2(chainId) ? "L2 " : "") : "";

  $: logoPos = pre ? (isLayer2(chainId) ? 25 : 0) : 0;

  $: logoStyle = `background: url("./assets/images/icon-${mainnetName}.png") no-repeat ${logoPos}px center/25px; padding: 5px 0;`;
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
