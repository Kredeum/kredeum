require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-abi-exporter");

module.exports = {
  defaultNetwork: "arbitrum",
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
    arbitrum: {
      // url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_API_KEY}`,
      url: "https://kovan5.arbitrum.io/rpc",
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://explorer5.arbitrum.io/#/",
      gasPrice: 0
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://kovan.etherscan.io"
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://rinkeby.etherscan.io"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://goerli.etherscan.io"
    },
    matic: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      chainId: 137,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://explorer-mainnet.maticvigil.com"
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      chainId: 80001,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://explorer-mumbai.maticvigil.com"
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
    tests: "tests",
    cache: "solidity/build/cache",
    artifacts: "solidity/build/artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
