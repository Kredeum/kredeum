import { runHandlebarsEnv } from "@utils/runHandlebarsEnv";

const main = async (): Promise<void> => {
  await runHandlebarsEnv("common/config/config.handlebars.json", "common/config/config.json");
};

main().catch(console.error);
