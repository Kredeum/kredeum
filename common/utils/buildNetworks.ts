import { runHandlebars } from "@utils/runHandlebars";

const buildNetworks = async (): Promise<void> => {
  await runHandlebars(`${__dirname}/../config/networks.handlebars.json`, `${__dirname}/../config/networks.json`);
};

export { buildNetworks };
