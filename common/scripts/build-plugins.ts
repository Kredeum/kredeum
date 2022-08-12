import config from "../config/config.json";
import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";

const _generate = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(pathIN)));
  const result = template(config);
  console.log("build", pathOUT, "from", pathIN);
  await writeFile(pathOUT, result);
};

const main = async (): Promise<void> => {
  await _generate("../wordpress/readme.txt_handlebars", "../wordpress/plugins/kredeum-nfts/readme.txt");
  await _generate("../wordpress/kredeum-nfts.php_handelbars", "../wordpress/plugins/kredeum-nfts/kredeum-nfts.php");
};

main().catch(console.error);
