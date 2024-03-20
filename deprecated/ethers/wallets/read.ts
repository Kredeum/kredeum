import { Wallet } from "ethers";
import fs from "fs";

if (process.argv.length < 3) {
  console.log("syntaxe : ts-node read.ts <file.json> [password]");
  process.exit(1);
}

const json = fs.readFileSync(process.argv[2], "utf8");
const password = process.argv.length >= 4 ? process.argv[3] : "";

const wallet = Wallet.fromEncryptedJsonSync(json, password);
console.log(wallet.address);
console.log(wallet.privateKey);
console.log(wallet.mnemonic);
