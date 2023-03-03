<script lang="ts">
  import { onMount } from "svelte";
  import { initDapp } from "@helpers/init";

  onMount(async () => console.log(await initDapp()));
</script>
