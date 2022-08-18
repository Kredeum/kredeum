import runHandlebars from "@utils/runHandlebars";

const main = async (): Promise<void> => {
  await runHandlebars("config/networks.handlebars.json", "config/networks.json");
};

main().catch(console.error);
