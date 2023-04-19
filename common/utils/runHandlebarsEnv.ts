
import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";

import dotenv from "dotenv";
import findupSync from "findup-sync";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!process.env.ENVIR) {
    throw new Error("ENV variable ENVIR not set!");
  }
}

const ROOT = `${__dirname}/../..`;

const runHandlebarsEnv = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(`${ROOT}/${pathIN}`)));

  const env = process.env;
  // console.log(env);

  const result = template(env);
  // console.log("build", `${ROOT}/${pathOUT}`, "from", pathIN);

  await writeFile(`${ROOT}/${pathOUT}`, result);

  console.log("runHandlebarsEnv   ", pathIN, "=>", pathOUT);
};

export { runHandlebarsEnv };
