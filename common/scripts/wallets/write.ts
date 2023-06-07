import { Wallet } from "ethers";

const privateKey = "";

const wallet = new Wallet(privateKey);
console.log(wallet);
console.log(wallet.address);
console.log(wallet.privateKey);
// console.log(wallet.mnemonic.phrase);
// console.log(wallet.mnemonic.path);

wallet.encrypt("lanZar0!").then(console.log).catch(console.error);
