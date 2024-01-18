<script lang="ts">
  import { networks } from "@lib/common/networks";
  import Network from "../components/Network/Network.svelte";
  import { NetworkType } from "@lib/common/types";

  /////////////////////////////////////////////////
  // <Networks  />
  // List Networks
  /////////////////////////////////////////////////
</script>

<div>
  {#each networks.getAll() as nwk}
    <p>
      <Network chainId={nwk.chainId} txt={true} />
    </p>
  {/each}
</div>
