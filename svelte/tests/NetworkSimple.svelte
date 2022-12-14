<script lang="ts">
  import { getChainName } from "@lib/common/config";
  export let chainId: number;
</script>

{getChainName(chainId)} ({chainId})
