<script lang="ts">
  import { versionGet } from "@helpers/version";

  /////////////////////////////////////////////////
  // <Title />
  // Dapp Title
  /////////////////////////////////////////////////
  const { detail, branch } = versionGet();
</script>

<h1 title="Kredeum NFTs Factory {detail}">
  My NFTs Factory ({branch})
</h1>
