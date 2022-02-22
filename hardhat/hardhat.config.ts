import type { HardhatUserConfig, HardhatNetworkAccountUserConfig } from "hardhat/types";

import { Wallet } from "ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-docgen";
import "hardhat-change-network";
import "hardhat-abi-exporter";
// import "hardhat-gas-reporter";
import "solidity-coverage";

import "@typechain/hardhat";
import "tsconfig-paths/register";

import "./tasks/index";

import dotenv from "dotenv";
import findupSync from "findup-sync";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!process.env.ENVIR) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const {
  DEPLOYER_PRIVATE_KEY,
  ALCHEMY_API_KEY,
  INFURA_API_KEY,
  ETHERSCAN_API_KEY,
  ETHERSCAN_API_KEY_FANTOM,
  ETHERSCAN_API_KEY_POLYGON,
  ETHERSCAN_API_KEY_AVALANCHE,
  ETHERSCAN_API_KEY_BINANCE
} = process.env;

const accountsRandom = [];
for (let i = 0; i < 5; i++) accountsRandom.push(Wallet.createRandom().privateKey);
const accountsHardhat: HardhatNetworkAccountUserConfig[] = accountsRandom.map((account) => ({
  privateKey: account || "",
  balance: "2000000000000000000000"
}));
const accounts = [DEPLOYER_PRIVATE_KEY || ""].concat(accountsRandom);

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
      accounts: accountsHardhat
    },
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    kovan: {
      chainId: 42,
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    bsc: {
      chainId: 56,
      url: "https://bsc-dataseed1.binance.org",
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_BINANCE
        }
      },
      accounts
    },
    matic: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_POLYGON
        }
      },
      // gasPrice: 50_000_000_000,
      accounts
    },
    fantom: {
      chainId: 250,
      url: "https://rpcapi.fantom.network",
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_FANTOM
        }
      },
      accounts
    },
    fuji: {
      chainId: 43113,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_AVALANCHE
        }
      },
      accounts
    },
    avalanche: {
      chainId: 43114,
      url: "https://api.avax.network/ext/bc/C/rpc",
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_AVALANCHE
        }
      },
      accounts
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
      live: true,
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY_POLYGON
        }
      }
    },
    optimism: {
      chainId: 10,
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    optimismkovan: {
      chainId: 69,
      url: `https://optimism-kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    },
    arbitrum: {
      chainId: 42161,
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
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
      url: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
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
    outDir: "../common/types"
  },
  abiExporter: {
    path: "../common/abis/new",
    runOnCompile: true,
    clear: false,
    flat: true,
    only: ["new"],
    spacing: 2,
    pretty: true
  },
  paths: {
    sources: "contracts",
    deploy: "deploy",
    deployments: "../common/deployments",
    tests: "tests",
    imports: "lib",
    cache: "cache",
    artifacts: "artifacts"
  },
  mocha: {
    timeout: 200_000,
    bail: true
  },
  docgen: {
    path: "docs",
    clear: true,
    runOnCompile: false
  },
  etherscan: { apiKey: ETHERSCAN_API_KEY }
};

export default config;
