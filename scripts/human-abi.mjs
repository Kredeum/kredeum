import { ethers } from "ethers";

import KRE0 from "../lib/KRE0.mjs";
import KRE1 from "../lib/KRE1.mjs";

const KRES = [KRE0, KRE1];
const networks = ["matic", "mumbai"];

KRES.forEach((KRE, i) => {
  networks.forEach((network) => {
    const addresses = KRE.ADDRESS[network];
    const abi = KRE.ABI;

    addresses.forEach((address) => {
      const kre = new ethers.Contract(address, abi);

      console.log(`v${i}`, network, address);
      console.log(kre.interface.format(["json"]));
    });
  });
});
