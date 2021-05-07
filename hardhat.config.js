require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-abi-exporter");

module.exports = {
  defaultNetwork: "mumbai",
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
    path: "solidity/abis",
    clear: true,
    // only: ['KRE'],
    flat: true
  },
  solidity: {
    compilers: [
      {
        version: "0.7.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
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
    cache: "solidity/cache",
    artifacts: "solidity/artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
