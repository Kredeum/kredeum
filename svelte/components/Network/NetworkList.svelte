<script lang="ts">
  import {  getNetwork, networks } from "@lib/common/config";
  import Network from "./Network.svelte";
  
  /////////////////////////////////////////////////
  // <NetworkList {chainId}  />
  // List Networks
  /////////////////////////////////////////////////
  export let chainId: number;
</script>

<div>
  {#each networks.filter((nw) => nw.mainnet && nw.nftsResolver) as nwk}
    <p>
      <Network chainId={nwk.chainId} txt={true} />
    </p>
  {/each}
  {#if getNetwork(chainId)?.testnet}
    {#each networks.filter((nw) => nw.testnet && nw.nftsResolver) as nwk}
      <p>
        <Network chainId={nwk.chainId} txt={true} />
      </p>
    {/each}
  {/if}
</div>
