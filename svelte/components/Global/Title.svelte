<script lang="ts">
  import { onMount } from "svelte";
  import semverSatisfies from "semver/functions/satisfies";
  import { config } from "lib/kconfig";

  const VERSION = "version";
  const version = config.version.latest;
  let branch = "";
  let detail = "";

  const cacheVersion = () => {
    if (typeof localStorage !== "undefined") {
      const versionOld = localStorage.getItem(VERSION);

      if (!semverSatisfies(version, `~${versionOld}`)) {
        console.info(`New version${versionOld ? ", previously " + versionOld : ""} => cache cleared`);
        localStorage.clear();
        localStorage.setItem(VERSION, version);
      }
    }
    console.log("Current Version", version);
  };

  onMount(() => {
    branch = process.env.GIT_BRANCH || "HEAD";
    detail = `v${version} (${branch} #${process.env.GIT_SHORT})`;

    console.log(`INIT Kredeum NFTs Factory ${detail}`);
    cacheVersion();
  });
</script>

<h1 title="Kredeum NFTs Factory {detail}">
  My NFTs Factory ({branch})
</h1>
