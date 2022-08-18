<script lang="ts">
  import { getChainName } from "@lib/kconfig";
  export let chainId: number;
</script>

{getChainName(chainId)} ({chainId})
