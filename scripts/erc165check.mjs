//  node  --experimental-json-modules  index.mjs
import { ethers } from "ethers";
import abis from "../config/abis.json";

const address = "0x34538444A64251c765c5e4c9715a16723CA922D8";

const rpcUrl = `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`;
const ethscan = "https://explorer-mumbai.maticvigil.com";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const codes = {
  ERC165: "0x01ffc9a7",
  ERC721: "0x80ac58cd",
  ERC721Metadata: "0x5b5e139f",
  ERC721Enumerable: "0x780e9d63",
  ERC721TokenReceiver: "0x150b7a02",
  FALSE: "0xffffffff"
};

const abi = ["function supportsInterface(bytes4) view returns (bool)"];
const contract = new ethers.Contract(address, abi, provider);

async function supports(codeName, code) {
  console.log(code, (await contract.supportsInterface(code)) ? "X" : " ", codeName);
}
// for (const code in codes) supports(code, codes[code]);

let iface = new ethers.utils.Interface(abis["ERC165"]);
console.log("sigHash", iface.getSighash(iface.fragments[0]));

iface = new ethers.utils.Interface(abis["ERC721Metadata"]);
console.log("sigHash0", iface.getSighash(iface.fragments[0]));
console.log("sigHash1", iface.getSighash(iface.fragments[1]));
console.log("sigHash2", iface.getSighash(iface.fragments[2]));

console.log(
  "sigHash012",
  iface.fragments
    .map((a) => iface.getSighash(a))
    .reduce((a, b) => a ^ b)
    .toString(16)
);

iface = new ethers.utils.Interface(abis["kredeum-nfts-v0"]);
console.log("sigHash kredeum-nfts-v0", iface.getSighash(iface.fragments[0]));

iface = new ethers.utils.Interface(abis["kredeum-nfts-v1"]);
console.log("sigHash kredeum-nfts-v1", iface.getSighash(iface.fragments[0]));
