import { Wallet } from "ethers";

const account = Wallet.createRandom();
console.log(account.privateKey);
console.log(account.publicKey);
