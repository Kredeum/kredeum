import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

console.log(wallet.address);
console.log(wallet.privateKey);
console.log(wallet.mnemonic.phrase);
console.log(wallet.mnemonic.path);

wallet.encrypt("pass").then(console.log).catch(console.error);
