import runHandlebars from "@utils/runHandlebars";

const buildNetworks = async (): Promise<void> => {
  await runHandlebars("config/networks.handlebars.json", "config/networks.json");
};

export { buildNetworks };
