type Network = {
  chainId: string;
  chainName: string;
  rpcUrls: Array<string>;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: Array<string>;
  subgraph?: {
    url?: string;
    startBlock?: number;
    active?: boolean;
  };
  covalent?: { active: boolean };
  type?: string;
  admin?: string;
  openSea?: { assets?: string; kredeum?: string };
  cloneFactory?: string;
};

const networks: Array<Network> = [
  {
    chainId: "0x1",
    chainName: "mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"],
    openSea: {
      assets: "https://opensea.io/assets",
      kredeum: "https://opensea.io/collection/kredeum-nfts"
    },
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/amxx/eip721-subgraph/graphql",
      active: false
    },
    covalent: { active: true },
    type: "mainnet"
  },
  {
    chainId: "0x4",
    chainName: "rinkeby",
    rpcUrls: ["https://rinkeby.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/zapaz/eip721-rinkeby",
      active: true
    },
    cloneFactory: "0x477f9e7F4c71b2C99aeC41c58D5CB786dCbB5Cf2",
    type: "testnet"
  },
  {
    chainId: "0x2a",
    chainName: "kovan",
    rpcUrls: ["https://kovan.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://kovan.etherscan.io"],
    covalent: { active: false },
    cloneFactory: "0xf783B0aad3120cB14De9f5C785561e1a0b985920",
    type: "testnet"
  },
  {
    chainId: "0x89",
    chainName: "matic",
    rpcUrls: ["https://polygon-mainnet.infura.io/v3", "https://rpc-mainnet.maticvigil.com/v1"],
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: [
      "https://polygonscan.com",
      "https://polygon-explorer-mainnet.chainstacklabs.com"
    ],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic",
      startBlock: 16875648,
      active: true
    },
    covalent: { active: true },
    openSea: {
      assets: "https://opensea.io/assets/matic",
      kredeum: "https://opensea.io/collection/kredeum-nfts"
    },
    admin: "0x981ab0D817710d8FFFC5693383C00D985A3BDa38",
    type: "mainnet"
  },
  {
    chainId: "0x13881",
    chainName: "mumbai",
    rpcUrls: ["https://polygon-mumbai.infura.io/v3", "https://rpc-mumbai.maticvigil.com/v1"],
    nativeCurrency: { name: "Matic", symbol: "tMATIC", decimals: 18 },
    blockExplorerUrls: [
      "https://mumbai.polygonscan.com",
      "https://polygon-explorer-mumbai.chainstacklabs.com"
    ],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai",
      active: true
    },
    covalent: { active: true },
    admin: "0x981ab0D817710d8FFFC5693383C00D985A3BDa38",
    cloneFactory: "0xf209D4e88f2846ed796FC51Db05cEcBD386D2547",
    type: "testnet"
  },
  {
    chainId: "",
    chainName: "arbitrum",
    rpcUrls: ["https://arbitrum-mainnet.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "AETH", decimals: 18 },
    blockExplorerUrls: ["https://explorer.arbitrum.io"],
    covalent: { active: true },
    admin: "0x981ab0D817710d8FFFC5693383C00D985A3BDa38",
    type: "off"
  },
  {
    chainId: "0x66eeb",
    chainName: "arbitrumrinkeby",
    rpcUrls: ["https://arbitrum-rinkeby.infura.io/v3"],
    nativeCurrency: { name: "Ether", symbol: "ARETH", decimals: 18 },
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io"],
    cloneFactory: "0x3f46967bAa872fb0D03A8C21c95D1D73CB01bb8F",
    covalent: { active: true },
    admin: "0x981ab0D817710d8FFFC5693383C00D985A3BDa38",
    type: "testnet"
  },
  {
    chainId: "0x38",
    chainName: "bsc",
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://bscscan.com"],
    covalent: { active: true },
    type: "mainnet"
  },
  {
    chainId: "0xa",
    chainName: "optimism",
    rpcUrls: ["https://kovan.optimism.io/rpc"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
    covalent: { active: false },
    type: "off"
  },
  {
    chainId: "0x45",
    chainName: "optimismkovan",
    rpcUrls: ["https://kovan.optimism.io/rpc"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
    covalent: { active: false },
    type: "testnet"
  },
  {
    chainId: "0xfa",
    chainName: "fantom",
    rpcUrls: ["https://rpcapi.fantom.network"],
    nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
    blockExplorerUrls: ["https://ftmscan.com"],
    covalent: { active: true },
    type: "mainnet"
  },
  {
    chainId: "0xa86a",
    chainName: "avalanche",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    blockExplorerUrls: ["https://cchain.explorer.avax.network"],
    covalent: { active: true },
    type: "off"
  },
  {
    chainId: "0xa869",
    chainName: "fuji",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    blockExplorerUrls: ["https://cchain.explorer.avax-test.network"],
    covalent: { active: true },
    type: "testnet"
  }
];

export { networks, Network };
