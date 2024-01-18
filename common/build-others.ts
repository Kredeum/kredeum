import { runHandlebarsEnv } from "@utils/runHandlebarsEnv";
import { runHandlebarsConfig } from "@utils/runHandlebarsConfig";

const main = async (): Promise<void> => {
  await runHandlebarsEnv("common/config/mainnets.handlebars.json", "common/config/mainnets.json");
  await runHandlebarsEnv("common/config/testnets.handlebars.json", "common/config/testnets.json");
  await runHandlebarsConfig("wordpress/readme.handlebars.txt", "wordpress/plugins/kredeum-nfts/readme.txt");
  await runHandlebarsConfig("wordpress/kredeum-nfts.handlebars.php", "wordpress/plugins/kredeum-nfts/kredeum-nfts.php");
};

main().catch(console.error);
