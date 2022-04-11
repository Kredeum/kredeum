<script lang="ts">
  import { onMount } from "svelte";
  // import semverSatisfies from "semver/functions/satisfies";
  import { config } from "lib/kconfig";

  let label = "";
  let version = "";

  const cacheVersion = (_version: string) => {
    console.log("cacheVersion ~ _version", _version);
    // const versionOld = storeGet("version") || "";
    // if (!semverSatisfies(_version, `~${versionOld}`)) {
    //   console.info(`New version, previously ${versionOld} => cache cleared!`);
    //   storeClearAll();
    // }
    // storeSet("version", _version);
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
