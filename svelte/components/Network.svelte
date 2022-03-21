<script lang="ts">
  import { getChainName } from "lib/kconfig";

  /////////////////////////////////////////////////
  // <Network {chainId} {txt} />
  // Display Network
  /////////////////////////////////////////////////
  export let chainId: number;
  export let txt: boolean = false;

  const strUpFirst = (str: string): string => (str.length >= 1 ? str.charAt(0).toUpperCase() + str.substr(1) : "");
</script>

{#if txt}
  {getChainName(chainId)}
{:else}
  <span class={getChainName(chainId)}>{strUpFirst(getChainName(chainId))}</span>
{/if}
