import type {
  HardhatUserConfig,
  HardhatNetworkAccountUserConfig,
  NetworksUserConfig,
  HttpNetworkUserConfig
} from "hardhat/types";

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
import networks from "config/networks.json";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!process.env.ENVIR) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const { DEPLOYER_PRIVATE_KEY, ETHERSCAN_API_KEY_ETHEREUM } = process.env;

const accountsRandom = [DEPLOYER_PRIVATE_KEY || ""];
for (let i = 0; i < 5; i++) accountsRandom.push(Wallet.createRandom().privateKey);
const accountsHardhat: HardhatNetworkAccountUserConfig[] = accountsRandom.map((account) => ({
  privateKey: account || "",
  balance: "2000000000000000000000"
}));
const accounts = accountsRandom;

const networksFromConfig = (): NetworksUserConfig => {
  const networksConfig: NetworksUserConfig = { hardhat: {} };

  // let network: NetworkType;
  for (const network of networks) {
    const networkConfig: HttpNetworkUserConfig = { chainId: network.chainId, url: network.rpcUrls[0], accounts };
    if (network.verifyApiKey) networkConfig.verify = { etherscan: { apiKey: network.verifyApiKey } };
    if (network.hardhatOptions) Object.assign(networkConfig, network.hardhatOptions);
    networkConfig.deploy = ["deploy/prod"];

    networksConfig[network.chainName] = networkConfig;
  }
  networksConfig.hardhat = { accounts: accountsHardhat, deploy: ["deploy/dev", "deploy/prod"] };

  // console.log(JSON.stringify(networksConfig, null, 2));
  return networksConfig;
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  namedAccounts: {
    admin: { default: 0 },
    deployer: { default: 0 },
    tester1: { default: 1 },
    random: { default: 2 }
  },

  networks: networksFromConfig(),

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
      clear: true,
      only: ["contracts"],
      flat: false,
      spacing: 2,
      format: "minimal",
      path: "../common/abis"
    }
  ],

  typechain: {
    target: "ethers-v5",
    // externalArtifacts: ["../common/abis/**/*.json"],
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

  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY_ETHEREUM
    }
  }
};

// console.log(JSON.stringify(config, null, 2));

export default config;
