import type { NetworkType, NetworkWriteableFieldsType } from "@lib/common/types";
import networks from "@config/networks.handlebars.json";
import { runHandlebarsEnv } from "@utils/runHandlebarsEnv";

import { writeFile } from "fs/promises";

const setNetwork = async (chainName: string, key: NetworkWriteableFieldsType, value: string): Promise<void> => {
  const index = networks.findIndex((nw) => nw.chainName === chainName);
  const network: NetworkType = networks[index];

  if (network[key] != value) {
    network[key] = value;

    await writeFile(`${__dirname}/../config/networks.handlebars.json`, JSON.stringify(networks, null, 2)).catch((err) =>
      console.error(err)
    );
    await runHandlebarsEnv("common/config/networks.handlebars.json", "common/config/networks.json");

    // console.info(`deployed new ${key} address => ${value}`);
  }
};

export { setNetwork };
