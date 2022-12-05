/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import config from "@config/config.json";
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

const runHandlebars = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(pathIN)));

  config.env = process.env;
  // console.log(config);

  const result = template(config);
  // console.log("build", pathOUT, "from", pathIN);

  await writeFile(pathOUT, result);
};

export { runHandlebars };
