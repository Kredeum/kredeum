// some data from https://github.com/ethereum-lists/chains/tree/master/_data/chains
// EIP3085 format

const networks = [
  {
    chainId: "0x1",
    chainName: "mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"]
  },
  {
    chainId: "0x89",
    chainName: "matic",
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/v1"],
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: [
      "https://polygon-explorer-mainnet.chainstacklabs.com/",
      "https://explorer-mainnet.maticvigil.com"
    ]
  },
  {
    chainId: "0x13881",
    chainName: "mumbai",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/v1"],
    nativeCurrency: { name: "Matic", symbol: "tMATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygon-explorer-mumbai.chainstacklabs.com", "https://explorer-mumbai.maticvigil.com"]
  }
];

export default networks;
