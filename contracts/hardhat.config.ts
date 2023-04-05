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
import "hardhat-change-network";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "@typechain/hardhat";
import "tsconfig-paths/register";

import "./tasks/index";

import dotenv from "dotenv";
import findupSync from "findup-sync";
import networks from "@config/networks.json";

const validEnv = (): boolean => "ENVIR" in process.env;

if (!validEnv()) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!validEnv()) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const accounts: Array<string> = [];
for (let i = 0; i < 5; i++) accounts.push(Wallet.createRandom().privateKey);
const accountsHardhat: HardhatNetworkAccountUserConfig[] = accounts.map((account) => ({
  privateKey: account || "",
  balance: "2000000000000000000000"
}));
if (process.env.DEPLOYER_PRIVATE_KEY) accounts.unshift(process.env.DEPLOYER_PRIVATE_KEY);
// console.log("accounts:", accounts);

const apiKeyConfig = (): string => {
  if (process.env.ETHERSCAN_API_KEY) return process.env.ETHERSCAN_API_KEY;

  const networkParamIndex = process.argv.findIndex((arg: string) => arg === "--network");
  const networkName: string = process.argv[networkParamIndex + 1];
  const network = networks.find((item) => item.chainName === networkName);

  process.env.ETHERSCAN_API_KEY = network?.etherscanApiKey || "";
  return process.env.ETHERSCAN_API_KEY;
};

const networksFromConfig = (): NetworksUserConfig => {
  const networksConfig: NetworksUserConfig = { hardhat: {} };

  // let network: NetworkType;
  for (const network of networks) {
    const networkConfig: HttpNetworkUserConfig = { chainId: network.chainId, url: network.rpcUrls[0], accounts };
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

  verify: {
    etherscan: {
      apiKey: apiKeyConfig()
    }
  },

  solidity: {
    compilers: [
      {
        version: "0.8.17",
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
        version: "0.8.7"
      },
      {
        version: "0.4.23"
      }
    ]
  },

  paths: {
    sources: "src",
    deploy: "deploy",
    deployments: "../common/deployments",
    tests: "tests",
    imports: "node_modules",
    cache: "cache-hardhat",
    artifacts: "artifacts"
  },

  abiExporter: [
    {
      runOnCompile: true,
      clear: true,
      flat: false,
      spacing: 2,
      format: "minimal",
      path: "../common/abis"
    }
  ],

  typechain: {
    target: "ethers-v5",
    outDir: "../common/types"
  },

  mocha: {
    timeout: 200_000,
    bail: true
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 50,
    onlyCalledMethods: true
  }
};

// console.log("config verify", config.verify.etherscan);
// console.log(JSON.stringify(config, null, 2));

export default config;
