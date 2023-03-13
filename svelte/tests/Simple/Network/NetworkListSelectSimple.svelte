<script lang="ts">
  import { networks } from "@lib/common/config";
  import NetworkSimple from "./NetworkSimple.svelte";

  /////////////////////////////////////////////////
  // <NetworksSelectSimple bind:{chainId}  />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  $: console.log("NetworksSelectSimple chainId CHANGE", chainId);

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _switchChainEvt = (evt?: Event) => (chainId = Number((evt.target as SwitchEventTarget).value));
</script>

<select on:change={_switchChainEvt}>
  {#each networks.filter((nw) => nw.mainnet && nw.nftsResolver) as _network}
    <option value={_network.chainId} selected={_network.chainId == chainId}>
      <NetworkSimple chainId={_network.chainId} />
    </option>
  {/each}
  {#each networks.filter((nw) => nw.testnet && nw.nftsResolver) as _network}
    <option value={_network.chainId} selected={_network.chainId == chainId}>
      <NetworkSimple chainId={_network.chainId} />
    </option>
  {/each}
</select>
