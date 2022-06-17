import type { HardhatUserConfig, HttpNetworkUserConfig, HardhatNetworkAccountUserConfig } from "hardhat/types";

import { Wallet } from "ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-docgen";
import "hardhat-change-network";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
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
  ETHERSCAN_API_KEY_ETHEREUM,
  ETHERSCAN_API_KEY_FANTOM,
  ETHERSCAN_API_KEY_POLYGON,
  ETHERSCAN_API_KEY_AVALANCHE,
  ETHERSCAN_API_KEY_BINANCE,
  ETHERSCAN_API_KEY_ARBITRUM,
  ETHERSCAN_API_KEY_OPTIMISM
} = process.env;

const accountsRandom = [DEPLOYER_PRIVATE_KEY || ""];
for (let i = 0; i < 5; i++) accountsRandom.push(Wallet.createRandom().privateKey);
const accountsHardhat: HardhatNetworkAccountUserConfig[] = accountsRandom.map((account) => ({
  privateKey: account || "",
  balance: "2000000000000000000000"
}));
const accounts = accountsRandom;

const netConf = (
  chainId: number,
  url: string,
  apiKey?: string,
  options: { live?: boolean; gasPrice?: number } = {}
): HttpNetworkUserConfig => {
  const networkConfig: HttpNetworkUserConfig = { chainId, url, accounts };

  if (apiKey) networkConfig.verify = { etherscan: { apiKey } };
  networkConfig.deploy = ["deploy/prod"];
  Object.assign(networkConfig, options);

  // console.log("networkConfig", networkConfig);
  return networkConfig;
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  namedAccounts: {
    admin: { default: 0 },
    deployer: { default: 0 },
    tester1: { default: 1 },
    random: { default: 2 }
  },

  networks: {
    hardhat: { accounts: accountsHardhat, deploy: ["deploy/tests", "deploy/prod"] },
    local: netConf(31337, "http://127.0.0.1:8545"),
    mainnet: netConf(1, `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`),
    ropsten: netConf(3, `https://ropsten.infura.io/v3/${INFURA_API_KEY}`),
    rinkeby: netConf(4, `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`),
    kovan: netConf(42, `https://kovan.infura.io/v3/${INFURA_API_KEY}`),
    goerli: netConf(5, `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`),
    bsc: netConf(56, "https://bsc-dataseed1.binance.org", ETHERSCAN_API_KEY_BINANCE),
    bsctestnet: netConf(97, "https://data-seed-prebsc-1-s1.binance.org:8545", ETHERSCAN_API_KEY_BINANCE),
    matic: netConf(137, `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`, ETHERSCAN_API_KEY_POLYGON),
    fantom: netConf(250, "https://rpcapi.fantom.network", ETHERSCAN_API_KEY_FANTOM),
    fantomtestnet: netConf(4002, "https://rpc.testnet.fantom.network", ETHERSCAN_API_KEY_FANTOM),
    avalanche: netConf(43114, "https://api.avax.network/ext/bc/C/rpc", ETHERSCAN_API_KEY_AVALANCHE),
    fuji: netConf(43113, "https://api.avax-test.network/ext/bc/C/rpc", ETHERSCAN_API_KEY_AVALANCHE),
    optimism: netConf(10, `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`, ETHERSCAN_API_KEY_OPTIMISM),
    optimismkovan: netConf(69, `https://optimism-kovan.infura.io/v3/${INFURA_API_KEY}`, ETHERSCAN_API_KEY_OPTIMISM),
    arbitrum: netConf(42161, `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`, ETHERSCAN_API_KEY_ARBITRUM),
    arbitrumrinkeby: netConf(
      421611,
      `https://arbitrum-rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      ETHERSCAN_API_KEY_ARBITRUM
    ),
    xdai: netConf(100, "https://rpc.ankr.com/gnosis", "", { gasPrice: 80_000_000_000 }),
    mumbai: netConf(80001, `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`, ETHERSCAN_API_KEY_POLYGON, {
      live: true
    })
  },

  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.7"
      },
      {
        version: "0.4.23"
      }
    ]
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

  abiExporter: [
    {
      runOnCompile: true,
      clear: false,
      flat: true,
      only: ["new"],
      spacing: 2,
      pretty: true,
      path: "../common/abis"
    }
  ],

  typechain: {
    target: "ethers-v5",
    // externalArtifacts: ["../common/abis/*.json"],
    outDir: "../common/types"
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

  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 50,
    onlyCalledMethods: true
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY_ETHEREUM
  }
};

export default config;
