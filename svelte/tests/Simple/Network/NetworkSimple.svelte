<script lang="ts">
  import { getChainName } from "@lib/common/config";
  export let chainId: number;

  /////////////////////////////////////////////////
  // <NetworkSimple />
  /////////////////////////////////////////////////
</script>

{getChainName(chainId)} -
{chainId}
