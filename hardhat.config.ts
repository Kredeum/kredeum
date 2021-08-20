import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/types";
import "tsconfig-paths/register";
import "./solidity/tasks/index";

const accounts = [
  process.env.ACCOUNT_KEY || "",
  process.env.PRIVATE_KEY_TEST_1 || "",
  process.env.PRIVATE_KEY_TEST_2 || ""
];

const config: HardhatUserConfig = {
  defaultNetwork: "rinkeby",
  namedAccounts: {
    admin: { default: 0 },
    deployer: { default: 0 }
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
        { privateKey: process.env.PRIVATE_KEY_TEST_1 || "", balance: "100000000000000000000" },
        { privateKey: process.env.PRIVATE_KEY_TEST_2 || "", balance: "100000000000000000000" }
      ]
    },
    fantom: {
      chainId: 250,
      url: `https://rpcapi.fantom.network`,
      accounts
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      gasPrice: 20000000000
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    kovan: {
      chainId: 6,
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    bsc: {
      chainId: 56,
      url: `https://bsc-dataseed1.binance.org`,
      accounts
    },
    matic: {
      chainId: 137,
      url: `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      // url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    mumbai: {
      chainId: 80001,
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      // url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts
    },
    arbitrum: {
      chainId: 421611,
      // url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_API_KEY}`,
      url: "https://kovan5.arbitrum.io/rpc",
      accounts
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
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
  typechain: {
    outDir: "solidity/build/artifacts/types",
    target: "ethers-v5"
  },
  paths: {
    sources: "solidity/contracts",
    deploy: "./solidity/deploy",
    deployments: "./solidity/deployments",
    tests: "./solidity/tests",
    cache: "./solidity/build/cache",
    artifacts: "./solidity/build/artifacts"
  },
  mocha: {
    timeout: 20000
  }
};

export default config;
