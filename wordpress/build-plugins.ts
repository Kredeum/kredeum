import khandlebars from "../common/lib/khandlebars";

const main = async (): Promise<void> => {
  await khandlebars("../wordpress/readme.txt_handlebars", "../wordpress/plugins/kredeum-nfts/readme.txt");
  await khandlebars("../wordpress/kredeum-nfts.php_handelbars", "../wordpress/plugins/kredeum-nfts/kredeum-nfts.php");
};

main().catch(console.error);
