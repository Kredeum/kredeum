<script lang="ts">
  import { versionGet } from "@kredeum/sveltekit/src/lib/helpers/version";

  /////////////////////////////////////////////////
  // <Title />
  // Dapp Title
  /////////////////////////////////////////////////
  const { detail, branch } = versionGet();

  const branchDisplay = branch == "HEAD" || branch == "main" ? "" : `(${branch})`;
</script>

<h1 title="Kredeum NFTs Factory {detail}">
  My NFTs Factory {branchDisplay}
</h1>
