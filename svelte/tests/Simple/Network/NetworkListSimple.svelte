<script lang="ts">
  import { networks } from "@lib/common/config";
  import NetworkSimple from "./NetworkSimple.svelte";

  /////////////////////////////////////////////////
  // <NetworksSimple />
  /////////////////////////////////////////////////
</script>

{#each networks.filter((nw) => nw.mainnet && nw.nftsResolver) as _network}
  <p>
    <NetworkSimple chainId={_network.chainId} />
  </p>
{/each}
{#each networks.filter((nw) => nw.testnet && nw.nftsResolver) as _network}
  <p>
    <NetworkSimple chainId={_network.chainId} />
  </p>
{/each}
