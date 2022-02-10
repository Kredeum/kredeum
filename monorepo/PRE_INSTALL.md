# PRE INSTALLATION

It's mandatory to pre-install "node" and ".env" file,
and recommanded to pre-install "pnpm" and "Visual Studio Code" with some extensions :

### MANDATORY

- **Node** v14+ :
  Install node v14 or v16

  - via this [download page](https://nodejs.org/en/download/)
  - or via **brew** on MacOS : `brew install node`

- **.env** environment file :
  You have to keep these variables secure in an environmment .env file :

  # PROD MANDATORY

  - ENVIR=DEV
  - NODE_DEBUG=false
  - INFURA_API_KEY=""
  - COVALENT_API_KEY=""
  - NFT_STORAGE_KEY=""

  # OPTIONAL FOR TESTS or DEPLOY

  - PRIVATE_KEY_0_DEPLOY=""
  - ETHERSCAN_API_KEY_ETHEREUM=""
  - ETHERSCAN_API_KEY_AVALANCHE=""
  - ETHERSCAN_API_KEY_POLYGON=""
  - ETHERSCAN_API_KEY_FANTOM=""
  - ETHERSCAN_API_KEY_BINANCE=""
  - THEGRAPH_KEY=""

  # OPTIONAL FOR TESTS ONLY

  PRIVATE_KEY_1_TEST=""
  PRIVATE_KEY_2_TEST=""

  - ALCHEMY_API_KEY=""

  You can get API_KEYs free from different providers

  Use .env.example to start with [Example.file](./.env.example)

  _ PRIVATE_KEY_0_DEPLOY is a private keys that requires some coins in order to deploy smartcontracts, be carefull to not share this key on the github repo._
  _ PRIVATE_KEY_1_TEST and PRIVATE_KEY_2_TEST are private keys only needed for testing, don't use private keys with real tokens._

### OPTIONAL

- **Pnpm** package manager : [homepage](https://github.com/pnpm/pnpm)

  Install latest version, can be done via this command
  `curl -f https://get.pnpm.io/v6.js | node - add --global pnpm`
  For your convenience, you can also add at the end of your ~/zshrc : `alias npm=pnpm`
  to keep typing `npm` instead of `pnpm`

- **Visual Studio Code** editor : [download page](https://code.visualstudio.com/)

  Install latest version, with some usefull extensions like :

  - Git Graph
  - Project Manager
  - Code Runner
  - PHP Intellisense
  - Bracket pair Colorizer
  - Local History
