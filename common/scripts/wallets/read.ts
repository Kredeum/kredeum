import { Wallet } from "ethers";

const pass = "pass";
const json = "";

const wallet = Wallet.fromEncryptedJsonSync(json, pass);
console.log(wallet.address);
console.log(wallet.privateKey);
console.log(wallet.mnemonic.phrase);
console.log(wallet.mnemonic.path);
