import { runHandlebarsConfig } from "@kredeum/config/scripts/handlebars";
import config from "@kredeum/config/dist/config.json";

const main = async (): Promise<void> => {
  await runHandlebarsConfig("readme.handlebars.txt", "plugins/kredeum-nfts/readme.txt", config);
  await runHandlebarsConfig("kredeum-nfts.handlebars.php", "plugins/kredeum-nfts/kredeum-nfts.php", config);
};

main().catch(console.error);
