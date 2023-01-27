<script lang="ts">
  import { onMount } from "svelte";
  import { initDapp } from "@helpers/initDapp";

  onMount(async () => console.log(await initDapp()));
</script>
