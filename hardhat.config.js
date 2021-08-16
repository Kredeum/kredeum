require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-abi-exporter");

const accounts = [
  process.env.ACCOUNT_KEY,
  process.env.PRIVATE_KEY_TEST_1,
  process.env.PRIVATE_KEY_TEST_2
];

module.exports = {
  defaultNetwork: "rinkeby",
  namedAccounts: {
    admin: { default: 0 }
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        // url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        // blockNumber: 23569930
      },
      accounts: [
        { privateKey: process.env.PRIVATE_KEY_TEST_1, balance: "100000000000000000000" },
        { privateKey: process.env.PRIVATE_KEY_TEST_2, balance: "100000000000000000000" }
      ]
    },
    fantom: {
      chainId: 250,
      url: `https://rpcapi.fantom.network`,
      accounts,
      ethscan: "https://ftmscan.com"
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://mainnet.etherscan.io"
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://ropsten.etherscan.io"
    },
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://rinkeby.etherscan.io"
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://goerli.etherscan.io"
    },
    kovan: {
      chainId: 6,
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://kovan.etherscan.io"
    },
    bsc: {
      chainId: 56,
      url: `https://bsc-dataseed1.binance.org`,
      accounts,
      ethscan: "https://bscscan.com"
    },
    matic: {
      chainId: 137,
      url: `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      // url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://explorer-mainnet.maticvigil.com"
    },
    mumbai: {
      chainId: 80001,
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      // url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      ethscan: "https://explorer-mumbai.maticvigil.com"
    },
    arbitrum: {
      chainId: 421611,
      // url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_API_KEY}`,
      url: "https://kovan5.arbitrum.io/rpc",
      accounts,
      ethscan: "https://explorer5.arbitrum.io/#/",
      gasPrice: 0
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  abiExporter: {
    path: "solidity/build/abis",
    clear: true,
    // only: ['KRE'],
    flat: true
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
    sources: "solidity/contracts",
    tests: "solidity/tests",
    cache: "solidity/build/cache",
    artifacts: "solidity/build/artifacts",
    deploy: "solidity/deploy",
    deployments: "solidity/deployments",
    imports: "solidity/imports"
  },
  mocha: {
    timeout: 20000
  }
};
