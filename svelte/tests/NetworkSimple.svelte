<script lang="ts">
  import { getChainName } from "@lib/common/kconfig";
  export let chainId: number;
</script>

{getChainName(chainId)} ({chainId})
