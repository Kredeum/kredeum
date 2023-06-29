import { Wallet } from "ethers";

const password = process.env.PASSWORD || "";
const json = process.env.JSON || "";

const wallet = Wallet.fromEncryptedJsonSync(json, password);
console.log(wallet.address);
console.log(wallet.privateKey);
// console.log(wallet.mnemonic.phrase);
// console.log(wallet.mnemonic.path);
