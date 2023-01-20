<script lang="ts">
  import { getChainName } from "@lib/common/config";

  /////////////////////////////////////////////////
  // <Network {chainId} {txt} />
  // Display Network
  /////////////////////////////////////////////////
  export let chainId: number;
  export let txt = false;

  const strUpFirst = (str: string): string => (str.length >= 1 ? str.charAt(0).toUpperCase() + str.substring(1) : "");
  $: console.log("<Network chainId", chainId, getChainName(chainId));
</script>

{#if txt}
  {getChainName(chainId)}
{:else}
  <span class={getChainName(chainId)}>{strUpFirst(getChainName(chainId))}</span>
{/if}
