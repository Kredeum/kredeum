<script lang="ts">
  import { page } from "$app/stores";
  import StatsNetwork from "$lib/components/StatsNetwork.svelte";
</script>

<StatsNetwork chainId={Number($page.params.chainId)} />
