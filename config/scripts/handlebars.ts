import { outputFile, readFile } from "fs-extra";
import Handlebars from "handlebars";

const runHandlebars = (buffer: string, vars: any): string => {
  const template = Handlebars.compile(buffer);

  const result = template(vars);
  // console.log("runHandlebars ~ result:", result);

  return result;
};

const runHandlebarsEnv = async (pathIN: string, pathOUT: string): Promise<void> => {
  const buffer = String(await readFile(pathIN));

  const result = runHandlebars(buffer, process.env);

  await outputFile(pathOUT, result);

  console.log("runHandlebarsEnv   ", pathIN, "=>", pathOUT);
};

const runHandlebarsConfig = async (pathIN: string, pathOUT: string, config: any): Promise<void> => {
  const buffer = String(await readFile(pathIN));

  const result = runHandlebars(buffer, config);

  await outputFile(pathOUT, result);

  console.log("runHandlebarsConfig", pathIN, "=>", pathOUT);
};

export { runHandlebars, runHandlebarsConfig, runHandlebarsEnv };
