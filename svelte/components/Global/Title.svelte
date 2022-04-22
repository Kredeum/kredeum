<script lang="ts">
  import { onMount } from "svelte";
  import semverSatisfies from "semver/functions/satisfies";
  import { config } from "lib/kconfig";

  let label = "";
  let version = "";
  const VERSION = "version";

  const cacheVersion = (version: string) => {
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
    version = config.version.latest;
    console.log(`INIT Kredeum NFTs Factory v${version}`);

    label = process.env.GIT_BRANCH === "main" ? "" : `(${process.env.GIT_BRANCH})`;

    cacheVersion(version);
  });
</script>

<h1 title="Kredeum NFTs v{config.version.latest} ({process.env.GIT_SHORT})">
  My NFTs Factory {label}
</h1>
