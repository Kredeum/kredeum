import config from "../config/config";
import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";

const main = async (): Promise<void> => {
  let template = Handlebars.compile("Hello {{world}}");
  let result = template({ world: "France" });
  // console.log(result);

  const version = config.version.stable;
  template = Handlebars.compile("version #{{version}}");
  result = template({ version });
  console.log(result);

  console.log("main ~ config", config);

  const phpReadmeIN = "../wordpress/readme.txt_handlebars";
  const phpReadmeOUT = "../wordpress/plugins/kredeum-nfts/readme.txt";

  template = Handlebars.compile(String(await readFile(phpReadmeIN)));
  result = template(config);
  console.log(result);
  await writeFile(phpReadmeOUT, result);
};

main().catch(console.error);
