//  node  --experimental-json-modules  erc165def.mjs
import { ethers } from "ethers";
import abis from "../config/abis.json";

function toHex(number) {
  const n = number < 0 ? 0x100000000 + number : number;
  return "0x" + Number(n).toString(16).padStart(8, "0");
}
function getSig(abi) {
  const iface = new ethers.utils.Interface(abi);
  // console.log(iface);
  return toHex(
    Object.values(iface.functions)
      .map((a) => iface.getSighash(a))
      .reduce((a, b) => a ^ b)
  );
}

for (let [spec, abi] of Object.entries(abis)) {
  console.log(getSig(abi), spec);
}
