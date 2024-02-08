<script lang="ts">
  import { versionGet } from "@svelte/helpers/version";

  /////////////////////////////////////////////////
  // <Title />
  // Dapp Title
  /////////////////////////////////////////////////
  const { version, branch, short } = versionGet();

  const detail = `v${version} (${branch} #${short})`;

  const branchDisplay = branch == "HEAD" || branch == "main" ? "" : `(${branch})`;
</script>

<h1 title="Kredeum NFTs Factory {detail}">
  My NFTs Factory {branchDisplay}
</h1>
