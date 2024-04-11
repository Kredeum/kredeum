import semverSatisfies from "semver/functions/satisfies";
import { config } from "@kredeum/common/src/common/config";
import { localStorageClear, localStorageGet, localStorageSet } from "@kredeum/common/src/common/local";

const versionGet = () => {
  const VERSION = "version";
  const version = config?.version?.latest || "";
  const branch = config?.version?.branch || "";
  const commit = config?.version?.commit || "";
  const short = commit?.substr(0, 8);

  const detail = `v${version} (${branch} #${short})`;

  console.info(`VERSION Kredeum NFTs Factory ${detail}`);
  {
    const versionOld = localStorageGet(VERSION);
    if (!semverSatisfies(version, `~${versionOld}`)) {
      console.info(`New version${versionOld ? ", previously " + versionOld : ""} => cache cleared`);
      localStorageClear();
      localStorageSet(VERSION, version);
    }
  }

  return { version, branch, short };
};

export { versionGet };
