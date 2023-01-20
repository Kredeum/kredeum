<script lang="ts">
  import { clickOutside } from "@helpers/clickOutside";
  import { getChainName, getNetwork, networks } from "@lib/common/config";
  import { resolverGetExplorerUrl, resolverGetAddress } from "@lib/resolver/resolver-get";

  import Network from "./Network.svelte";

  import CopyRefItem from "../Global/CopyRefItem.svelte";

  /////////////////////////////////////////////////
  // <NetworkSelect bind:{chainId} {txt} {label} />
  // Select Network via a list box
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
