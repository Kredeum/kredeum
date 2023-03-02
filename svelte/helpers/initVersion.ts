import semverSatisfies from "semver/functions/satisfies";
import { config } from "@lib/common/config";

const initVersion = () => {
  const VERSION = "version";
  const version = config.version.latest;
  const branch = process.env.GIT_BRANCH || "HEAD";
  const detail = `v${version} (${branch} #${process.env.GIT_SHORT})`;

  console.info(`VERSION Kredeum NFTs Factory ${detail}`);

  if (typeof localStorage !== "undefined") {
    const versionOld = localStorage.getItem(VERSION);

    if (!semverSatisfies(version, `~${versionOld}`)) {
      console.info(`New version${versionOld ? ", previously " + versionOld : ""} => cache cleared`);
      localStorage.clear();
      localStorage.setItem(VERSION, version);
    }
  }

  return { branch, detail };
};

export { initVersion };
