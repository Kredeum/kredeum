import type { NetworkType, NetworkWriteableFieldsType } from "@lib/ktypes";
import networks from "@config/networks.handlebars.json";
import { buildNetworks } from "@utils/buildNetworks";

import { writeFile } from "fs/promises";

const setNetwork = async (chainName: string, key: NetworkWriteableFieldsType, value: string): Promise<void> => {
  const index = networks.findIndex((nw) => nw.chainName === chainName);
  const network: NetworkType = networks[index];
  
  if (network[key] != value) {
    network[key] = value;

    await writeFile(`${__dirname}/../config/networks.handlebars.json`, JSON.stringify(networks, null, 2)).catch((err) =>
      console.log(err)
    );
    await buildNetworks();

    console.info(`deployed new ${key} address => ${value}`);
  }
};

export { setNetwork };
