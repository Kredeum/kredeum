import { runHandlebarsEnv, runHandlebarsConfig } from "./handlebars";

const main = async (): Promise<void> => {
  await runHandlebarsEnv("src/config.handlebars.json", "dist/config.json");
  await runHandlebarsEnv("src/mainnets.handlebars.json", "dist/mainnets.json");
  await runHandlebarsEnv("src/testnets.handlebars.json", "dist/testnets.json");
};

main().catch(console.error);
