import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-docgen";

import "@typechain/hardhat";
import type { HardhatUserConfig } from "hardhat/types";
import "tsconfig-paths/register";
import "./solidity/tasks/index";

import dotenv from "dotenv";
import findupSync from "findup-sync";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") });
  if (!process.env.ENVIR) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const accounts = [
  process.env.PRIVATE_KEY_0_DEPLOY || "",
  process.env.PRIVATE_KEY_1_TEST || "",
  process.env.PRIVATE_KEY_2_TEST || ""
];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    admin: { default: 0 },
    deployer: { default: 0 },
    tester1: { default: 1 },
    random: { default: 2 }
  },
  networks: {
    hardhat: {
      // loggingEnabled: true,
      // forking: {
      //   // url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      //   url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      //   blockNumber: 18000000
      // },
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY_0_DEPLOY || "",
          balance: "100000000000000000000"
        },
        {
          privateKey: process.env.PRIVATE_KEY_1_TEST || "",
          balance: "100000000000000000000"
        }
      ]
    },
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      chainId: 1,
      // url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      // url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      // gasPrice: 20_000_000_000,
      accounts
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    kovan: {
      chainId: 42,
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    bsc: {
      chainId: 56,
      url: "https://bsc-dataseed1.binance.org",
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_BINANCE },
      accounts
    },
    matic: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_POLYGON },
      // gasPrice: 50_000_000_000,
      accounts
    },
    fantom: {
      chainId: 250,
      url: "https://rpcapi.fantom.network",
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_FANTOM },
      accounts
    },
    fuji: {
      chainId: 43113,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_AVALANCHE },
      accounts
    },
    avalanche: {
      chainId: 43114,
      url: "https://api.avax.network/ext/bc/C/rpc",
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_AVALANCHE },
      accounts
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      // gasPrice: 20_000_000_000,
      live: true,
      etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_POLYGON }
    },
    optimism: {
      chainId: 10,
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    optimismkovan: {
      chainId: 69,
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    arbitrum: {
      chainId: 42161,
      // url: "https://arb1.arbitrum.io/rpc",
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    xdai: {
      chainId: 100,
      url: "https://rpc.xdaichain.com/",
      gasPrice: 80_000_000_000,
      accounts
    },
    arbitrumrinkeby: {
      chainId: 421611,
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      // url: "https://rinkeby.arbitrum.io/rpc",
      // gasPrice: 20_000_000_000,
      accounts
    }
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
      },
      {
        version: "0.8.9"
      },
      {
        version: "0.4.23"
      }
    ]
  },
  typechain: {
    target: "ethers-v5",
    outDir: "solidity/types"
  },
  paths: {
    sources: "solidity/contracts",
    deploy: "solidity/deploy",
    deployments: "solidity/deployments",
    tests: "solidity/tests",
    imports: "lib",
    cache: "solidity/artifacts/cache",
    artifacts: "solidity/artifacts"
  },
  mocha: {
    timeout: 200_000,
    bail: true
  },
  docgen: {
    path: "solidity/docs",
    clear: true,
    runOnCompile: false
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY_ETHEREUM }
};

export default config;
