import { runHandlebarsEnv } from "@utils/runHandlebarsEnv";
import { runHandlebarsConfig } from "@utils/runHandlebarsConfig";

const main = async (): Promise<void> => {
  await runHandlebarsEnv("common/config/networks.handlebars.json", "common/config/networks.json");
  await runHandlebarsConfig("wordpress/readme.handlebars.txt", "wordpress/plugins/kredeum-nfts/readme.txt");
  await runHandlebarsConfig("wordpress/kredeum-nfts.handlebars.php", "wordpress/plugins/kredeum-nfts/kredeum-nfts.php");
};

main().catch(console.error);
