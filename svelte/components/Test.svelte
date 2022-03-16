<script lang="ts">
  import NftViewNew from "./NftViewNew.svelte";
  import { refFromUrl } from "main/refs";
</script>

<main>
  <NftViewNew {...refFromUrl()} />
</main>
