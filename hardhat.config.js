require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

const {
  PRIVATE_KEY_TEST_1,
  PRIVATE_KEY_TEST_2,
  ALCHEMY_API_KEY,
  INFURA_API_KEY,
  ETHERSCAN_API_KEY,
  MATICVIGIL_API_KEY
} = require('../secrets.json');


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'polygon',
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        // url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
        // blockNumber: 23569930
      },
      accounts: [
        { privateKey: PRIVATE_KEY_TEST_1, balance: '100000000000000000000' },
        { privateKey: PRIVATE_KEY_TEST_2, balance: '100000000000000000000' }
      ]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [process.env.ACCOUNT_KEY],
    },
    polygon: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${MATICVIGIL_API_KEY}`,
      chainId: 137,
      accounts: [process.env.ACCOUNT_KEY],
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_API_KEY}`,
      chainId: 80001,
      accounts: [process.env.ACCOUNT_KEY],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  abiExporter: {
    path: './solidity/abis',
    clear: true,
    // only: ['KRU'],
    flat: true
  },
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./solidity",
    tests: "./tests",
    cache: "./solidity/cache",
    artifacts: "./solidity/artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
