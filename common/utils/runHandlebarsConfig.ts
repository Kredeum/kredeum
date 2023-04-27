import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";
import config from "@config/config.json";

const ROOT = `${__dirname}/../..`;

const runHandlebarsConfig = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(`${ROOT}/${pathIN}`)));

  const result = template(config);
  // console.log("build", `${ROOT}/${pathOUT}`, "from", pathIN);

  await writeFile(`${ROOT}/${pathOUT}`, result);

  console.log("runHandlebarsConfig", pathIN, "=>",pathOUT);
};

export { runHandlebarsConfig };
