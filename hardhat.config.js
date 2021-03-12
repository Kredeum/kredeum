require("@nomiclabs/hardhat-waffle");

const { PRIVATE_KEY_TEST_1, PRIVATE_KEY_TEST_2 } = require('../secrets.json');


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
  defaultNetwork: 'rinkeby',
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        // url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        // blockNumber: 23569930
      },
      accounts: [
        { privateKey: PRIVATE_KEY_TEST_1, balance: '100000000000000000000' },
        { privateKey: PRIVATE_KEY_TEST_2, balance: '100000000000000000000' }
      ]
    },
    rinkeby: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY_TEST_1, PRIVATE_KEY_TEST_2]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  solidity: '0.7.3',
  abiExporter: {
    path: './abis',
    clear: true,
    only: ['kru'],
    flat: true
  }
};
