import config from "../config/config.json";
import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";

const khandlebars = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(pathIN)));
  const result = template(config);
  console.log("build", pathOUT, "from", pathIN);
  await writeFile(pathOUT, result);
};

export default khandlebars;