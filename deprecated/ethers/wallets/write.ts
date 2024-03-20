import { Wallet } from "ethers";

const privateKey = process.env.PRIVATE_KEY || "";
const password = process.env.PASSWORD || "";

const wallet = new Wallet(privateKey);
console.log(wallet);
console.log(wallet.address);
console.log(wallet.privateKey);

wallet
  .encrypt(password)
  .then((json) => console.log(JSON.stringify(JSON.parse(json), null, 2)))
  .catch(console.error);
