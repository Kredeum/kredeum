import { runHandlebars } from "@utils/runHandlebars";

const main = async (): Promise<void> => {
  await runHandlebars("../wordpress/readme.txt_handlebars", "../wordpress/plugins/kredeum-nfts/readme.txt");
  await runHandlebars("../wordpress/kredeum-nfts.php_handelbars", "../wordpress/plugins/kredeum-nfts/kredeum-nfts.php");
};

main().catch(console.error);
