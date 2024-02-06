import semverSatisfies from "semver/functions/satisfies";
import { config } from "@common/common/config";
import { localStorageClear, localStorageGet, localStorageSet } from "@common/common/local";
// import { env } from "$env/dynamic/public";

type EnvType = {
  PUBLIC_GIT_BRANCH: string;
  PUBLIC_GIT_SHORT: string;
};

const versionGet = () => {
  const VERSION = "version";
  const version = config.version.latest;

  // console.log("versionGet ~ env:", env);
  // const branch = (env as EnvType).PUBLIC_GIT_BRANCH || "HEAD";
  // const detail = `v${version} (${branch} #${(env as EnvType).PUBLIC_GIT_SHORT})`;
  const branch = "";
  const detail = "";

  console.info(`VERSION Kredeum NFTs Factory ${detail}`);
  {
    const versionOld = localStorageGet(VERSION);
    if (!semverSatisfies(version, `~${versionOld}`)) {
      console.info(`New version${versionOld ? ", previously " + versionOld : ""} => cache cleared`);
      localStorageClear();
      localStorageSet(VERSION, version);
    }
  }

  return { branch, detail };
};

export { versionGet };
