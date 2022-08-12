const networks = [
  {
    chainId: 1,
    chainName: "mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://etherscan.io"],
    openSea: "https://opensea.io/assets",
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph",
      active: true
    },
    alchemy: {
      url: "https://eth-mainnet.alchemyapi.io/v2",
      active: true
    },
    covalent: {
      active: true
    },
    eip1559: true,
    create: true,
    mainnet: true,
    openNFTs: "0x82a398243EBc2CB26a4A21B9427EC6Db8c224471",
    nftsFactory: "0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800"
  },
  {
    chainId: 42161,
    chainName: "arbitrum",
    rpcUrls: ["https://arbitrum-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://arbiscan.io", "https://explorer.arbitrum.io"],
    covalent: {
      active: false
    },
    create: true,
    mainnet: true,
    openNFTs: "0x8a324A30C8ca1E9CFcea267C2116968cAacEd1D6",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800"
  },
  {
    chainId: 10,
    chainName: "optimism",
    rpcUrls: ["https://mainnet.optimism.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    covalent: {
      active: false
    },
    openNFTs: "0x353e747242CD4806Cb18D70a42cEa01512b18A3B",
    nftsFactoryV2: "0x03F9c54b5D5De9b2323d944Faa406E3F20734B67",
    create: true,
    mainnet: true
  },
  {
    chainId: 137,
    chainName: "matic",
    rpcUrls: ["https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", "https://polygon-rpc.com/"],
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com", "https://polygon-explorer-mainnet.chainstacklabs.com"],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic",
      startBlock: 16875648,
      active: false
    },
    alchemy: {
      url: "https://polygon-mainnet.g.alchemy.com/v2",
      active: true
    },
    covalent: {
      active: true
    },
    openSea: "https://opensea.io/assets/matic",
    openNFTs: "0xda67B337B777AE6Cf99DcAbD5c38916DDc2CF5d5",
    nftsFactory: "0x3157Ac677F6F273b75E99A2216CD078E22E9be02",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    mainnet: true,
    nftsResolver: "0xC23D940Ecb611DEca68CE09736A4028371A320c6"
  },
  {
    chainId: 43114,
    chainName: "avalanche",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18
    },
    blockExplorerUrls: ["https://snowtrace.io", "https://cchain.explorer.avax.network"],
    covalent: {
      active: true
    },
    openNFTs: "0xd719d8bA14F7EA708b42fFA0903d430F1B1c88a9",
    nftsFactory: "0x0ED91009756b1d684F2D953f56cF84373D8CEB25",
    nftsFactoryV2: "0x016fa6b76Fb24e651806455e58710d48880226f9",
    create: true,
    mainnet: true
  },
  {
    chainId: 100,
    chainName: "xdai",
    rpcUrls: [
      "https://rpc.ankr.com/gnosis",
      "https://rpc.xdaichain.com",
      "https://xdai.poanetwork.dev/",
      "https://dai.poa.network/"
    ],
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18
    },
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"],
    openNFTs: "0xF6169393986b38e57D61187051c3F5B554796f83",
    nftsFactory: "0x86246ba8F7b25B1650BaF926E42B66Ec18D96000",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    mainnet: true
  },
  {
    chainId: 250,
    chainName: "fantom",
    rpcUrls: ["https://rpc.ftm.tools/", "https://rpcapi.fantom.network"],
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18
    },
    blockExplorerUrls: ["https://ftmscan.com"],
    covalent: {
      active: true
    },
    openNFTs: "0x5E03Acd53d5D3A834278014D91F0AFD36f8147Ce",
    nftsFactory: "0x03F9c54b5D5De9b2323d944Faa406E3F20734B67",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    mainnet: true
  },
  {
    chainId: 56,
    chainName: "bsc",
    rpcUrls: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed1.ninicoin.io"
    ],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://bscscan.com"],
    covalent: {
      active: true
    },
    openNFTs: "0x57bdf6e59c2652d349f7022beb8d1b7458ca09eb",
    nftsFactory: "0x03F9c54b5D5De9b2323d944Faa406E3F20734B67",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    mainnet: true
  },
  {
    chainId: 97,
    chainName: "bsctestnet",
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545"
    ],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    covalent: {
      active: true
    },
    openNFTs: "0x3f46967bAa872fb0D03A8C21c95D1D73CB01bb8F",
    nftsFactoryV2: "0x79F74cB4cE9FA902AC603DfEb7D04b03F3575EBf",
    create: true,
    testnet: true
  },
  {
    chainId: 4,
    chainName: "rinkeby",
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/zapaz/eip721-rinkeby",
      active: true
    },
    eip1559: true,
    openNFTs: "0xF85795E50e247a52A6d14389bEcaD4998a691477",
    nftsFactory: "0xec7EBB4E7cdcE23e992BFDc4fc81D89Cc9Ac9A74",
    nftsFactoryV2: "0x6FC132204A4f1a93785a11123b1062F05697a751",
    create: true,
    testnet: true
  },
  {
    chainId: 5,
    chainName: "goerli",
    rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/zapaz/eip721-goerli",
      active: false
    },
    eip1559: true,
    openNFTs: "0x543dbd425309c3aFcAcE98Ac99bfb1f705624E91",
    nftsFactory: "0x636BeA69422e087eA87Ae6A98300065C11826b2C",
    nftsFactoryV2: "0xBda19424590E3DB9DF04091F7510F487eD19E037",
    create: true,
    testnet: true,
    openMulti: "0xC9D75c6dC5A75315ff68A4CB6fba5c53aBed82d0",
    openBound: "0xae9159De1FB5dE80093130a0c8fb07A42BfD9E15",
    nftsResolver: "0xe93f53292249630aB09e0408dB6D8b144E5414D1"
  },
  {
    chainId: 3,
    chainName: "ropsten",
    rpcUrls: ["https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", "https://ropsten.infura.io/v3/"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://ropsten.etherscan.io"],
    covalent: {
      active: false
    },
    eip1559: true,
    openNFTs: "0x7B5E42Ab37Bf962413a2B062fE7373141e643f46",
    nftsFactoryV2: "0x3fB23c510e46B5d226Fc8635A4a6FB6Fde09719F",
    create: true,
    testnet: true
  },
  {
    chainId: 42,
    chainName: "kovan",
    rpcUrls: ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://kovan.etherscan.io"],
    covalent: {
      active: false
    },
    eip1559: true,
    openMulti: "0xbd576e2F8590e7Ad02b3E92edEb591fD5331fbfC",
    openNFTs: "0x59Ca965eB4EafCE4e05eD2b5Bccbd373c3d1e2F8",
    nftsFactory: "0xA6F70de9aBe6cAE865fa723f7741699B63f47517",
    nftsFactoryV2: "0x3BDF67A8900AE9545Ea89121e9215B96C2e84722",
    create: true,
    testnet: true,
    openBound: "0x0827563013d242A657478450D4231756fB75C5bE",
    nftsResolver: "0x28E561620C45Dd30d2B516fE746BE38600dC4134"
  },
  {
    chainId: 80001,
    chainName: "mumbai",
    rpcUrls: [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com/v1",
      "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    ],
    nativeCurrency: {
      name: "Matic",
      symbol: "tMATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com", "https://polygon-explorer-mumbai.chainstacklabs.com"],
    subgraph: {
      url: "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai",
      active: true
    },
    covalent: {
      active: true
    },
    openNFTs: "0x034595F8fec2bF8eE641EFf1667144923356d4eF",
    nftsFactory: "0x89bB80B13Eee16ed88DF4357009856CbAd8ba035",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    testnet: true,
    openMulti: "0x32F7186d9cFaEbBDCC9db82d30eE1883ce83cfCf",
    nftsResolver: "0x2D44a9d14C3c86daa22Bad0f344db6eef55000ab",
    openBound: "0x54a89e6DA78f9476790F8156860D9B01827bc59a"
  },
  {
    chainId: 421611,
    chainName: "arbitrumrinkeby",
    rpcUrls: ["https://arbitrum-rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ARETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://testnet.arbiscan.io", "https://rinkeby-explorer.arbitrum.io"],
    covalent: {
      active: true
    },
    openNFTs: "",
    nftsFactory: "0x5E03Acd53d5D3A834278014D91F0AFD36f8147Ce",
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    testnet: true
  },
  {
    chainId: 69,
    chainName: "optimismkovan",
    rpcUrls: ["https://kovan.optimism.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
    covalent: {
      active: false
    },
    openNFTs: "0xBda19424590E3DB9DF04091F7510F487eD19E037",
    nftsFactory: "0x636BeA69422e087eA87Ae6A98300065C11826b2C",
    nftsFactoryV2: "0xD53e7aa446e4615DEC602c1D0d024425256f631a",
    create: true,
    testnet: true
  },
  {
    chainId: 4002,
    chainName: "fantomtestnet",
    rpcUrls: ["https://rpc.testnet.fantom.network"],
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18
    },
    blockExplorerUrls: ["https://testnet.ftmscan.com"],
    covalent: {
      active: false
    },
    nftsFactoryV2: "0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800",
    create: true,
    testnet: true
  },
  {
    chainId: 43113,
    chainName: "fuji",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18
    },
    blockExplorerUrls: ["https://testnet.snowtrace.io", "https://cchain.explorer.avax-test.network"],
    covalent: {
      active: true
    },
    openNFTs: "",
    nftsFactory: "0xC308A8c2fbDea84D1028F906cf966492B14645a0",
    nftsFactoryV2: "0x98C1c1AA566C329f339488Af2F8F95D33cf1A507",
    create: true,
    testnet: true
  },
  {
    chainId: 31337,
    chainName: "hardhat",
    rpcUrls: ["http://127.0.0.1:8545"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["http://localhost/explorer"],
    openNFTs: "0x7B5E42Ab37Bf962413a2B062fE7373141e643f46",
    openMulti: "0xBda19424590E3DB9DF04091F7510F487eD19E037",
    openBound: "0xfa44e688bD672b46dcF70CFD467cE10139d3d8DF",
    nftsFactory: "0x3f46967bAa872fb0D03A8C21c95D1D73CB01bb8F",
    nftsFactoryV2: "0x636BeA69422e087eA87Ae6A98300065C11826b2C",
    testnet: true,
    nftsResolver: "0x5E03Acd53d5D3A834278014D91F0AFD36f8147Ce"
  }
];

export default networks;
