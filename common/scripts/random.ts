import { Wallet } from "ethers";

const signer = Wallet.createRandom();

console.log(signer.address);
console.log(signer.privateKey);
