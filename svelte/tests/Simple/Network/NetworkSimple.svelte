<script lang="ts">
  import { networks } from "@lib/common/networks";

  export let chainId: number;

  /////////////////////////////////////////////////
  // <NetworkSimple />
  /////////////////////////////////////////////////
</script>

{networks.getChainName(chainId)} -
{chainId}
