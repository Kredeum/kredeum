import { Wallet } from "ethers";

const wallet = Wallet.createRandom();
const password = process.env.PASSWORD || "";

console.log(wallet.address);
console.log(wallet.privateKey);
console.log(wallet.mnemonic.phrase);
console.log(wallet.mnemonic.path);

wallet.encrypt(password).then(console.log).catch(console.error);
