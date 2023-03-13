<script lang="ts">
  import { onMount } from "svelte";
  import { refPageFromUrlHash } from "@helpers/refPage";
  import { providerSetFallback } from "@lib/common/provider-get";

  onMount(async () => {
    const refHash = refPageFromUrlHash(window.location.hash);

    providerSetFallback(refHash.chainId).catch(console.error);
  });
</script>
