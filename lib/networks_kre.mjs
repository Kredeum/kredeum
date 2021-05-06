import networks from "../lib/networks.mjs";

// const INFURA_API_KEY = "013641c7bbd54950b64584b51a782d0e";
const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

// const mainnet = networks.find((n) => n.chainId === "0x1");
// mainnet.rpcUrl = `${mainnet.rpc}/${INFURA_API_KEY}`;

console.log(networks);
const networksKRE = {};

const matic = networks.find((n) => n.chainId === "0x89");
matic.rpcUrls[0] = `${matic.rpcUrls[0]}/${MATICVIGIL_API_KEY}`;

const mumbai = networks.find((n) => n.chainId === "0x13881");
mumbai.rpcUrls[0] = `${mumbai.rpcUrls[0]}/${MATICVIGIL_API_KEY}`;

networksKRE.list = [matic, mumbai];

networksKRE.find = function (chainId) {
  return networksKRE.list.find((network) => Number(network.chainId) === Number(chainId));
};

export default networksKRE;
