import networks from "./networks.mjs";

// const INFURA_API_KEY = "013641c7bbd54950b64584b51a782d0e";
const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

// const mainnet = networks.find((nw) => nw.chainId === "0x1");
// mainnet.rpcUrl = `${mainnet.rpc}/${INFURA_API_KEY}`;

const matic = networks.find((nw) => nw.chainId === "0x89");
const mumbai = networks.find((nw) => nw.chainId === "0x13881");

const networksKRE = [
  {
    chainId: matic.chainId,
    chainName: matic.chainName,
    nativeCurrency: matic.nativeCurrency,
    explorer: matic.blockExplorerUrls[0],
    rpcUrl: `${matic.rpcUrls[0]}/${MATICVIGIL_API_KEY}`,
    // subgraphUrl: "https://api.thegraph.com/subgraphs/name/zapaz/kredeum-nft",
    openSeaAssets: "https://opensea.io/assets/matic",
    openSeaKredeum: "https://opensea.io/collection/kredeum-nfts"
  },
  {
    chainId: mumbai.chainId,
    chainName: mumbai.chainName,
    nativeCurrency: mumbai.nativeCurrency,
    explorer: mumbai.blockExplorerUrls[0],
    rpcUrl: `${mumbai.rpcUrls[0]}/${MATICVIGIL_API_KEY}`,
    openSeaAssets: "https://opensea.io/assets/mumbai",
    openSeaKredeum: "https://opensea.io/collection/kredeum-nfts"
  }
];

export default networksKRE;
