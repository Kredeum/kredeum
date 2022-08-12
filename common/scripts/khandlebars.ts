/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import config from "../config/config.json";
import Handlebars from "handlebars";
import { readFile, writeFile } from "fs-extra";

import dotenv from "dotenv";
import findupSync from "findup-sync";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!process.env.ENVIR) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const envKeys = [
  "ENVIR",
  "ALCHEMY_API_KEY",
  "INFURA_API_KEY",
  "ETHERSCAN_API_KEY_ETHEREUM",
  "ETHERSCAN_API_KEY_FANTOM",
  "ETHERSCAN_API_KEY_POLYGON",
  "ETHERSCAN_API_KEY_AVALANCHE",
  "ETHERSCAN_API_KEY_BINANCE",
  "ETHERSCAN_API_KEY_ARBITRUM",
  "ETHERSCAN_API_KEY_OPTIMISM"
];

const processEnv = Object.assign({}, ...envKeys.map((key: string) => ({ [key]: process.env[key] })));

const khandlebars = async (pathIN: string, pathOUT: string): Promise<void> => {
  const template = Handlebars.compile(String(await readFile(pathIN)));

  config.env = processEnv;
  // console.log(config);

  const result = template(config);
  console.log("build", pathOUT, "from", pathIN);

  await writeFile(pathOUT, result);
};

export default khandlebars;
