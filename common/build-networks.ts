import khandlebars from "./scripts/khandlebars";

const main = async (): Promise<void> => {
  await khandlebars("config/networks.handlebars.json", "config/networks.json");
};

main().catch(console.error);
