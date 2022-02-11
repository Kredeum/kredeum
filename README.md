# Kredeum NFTs

## Installation

Before installation, you need "node" and "pnpm" installed and a ".env" file setup.
_Check page's bottom to get pre-installation instructions_

### Running the Dapp

Build the DAPP via this command :

- `npm run build-dapp`

and then go to http://localhost:5000

## Running the Plugin

In order to run the plugin you need a WordPress installation on your local disk
and link `wordpress/kredeum-nfts` inside the pugin directory of your WordPress installation

Then, you have to rebuild the js lib, after each modification, to take effect :

- `npm run build-plugin`

## More advanced commands

#### Kredeum NFTs is splitted in modules like this :

1. wordPress : WordPress Plugin
1. hardhat : Smartcontrats hardhat environment
1. gulp : Gulp static UI builder
1. svelte : Svelte dynamic UI builder
1. thegraph : The Graph subgraph to index NFTs
1. common : common library, config and other common datas
1. misc : other tools, datas and archives (old)

In each of these specifi directories you will acces more advance commands

## Pre installation

- **NODE** v14 :
  Install node v14

  - via this [download page](https://nodejs.org/en/download/)
  - or via **brew** on MacOS : `brew install node`

- **ENV** .env environment file :
  You have to keep these variables secure in an environmment .env file :

  - ENVIR=DEV
  - NODE_DEBUG=false
  - INFURA_API_KEY=""
  - COVALENT_API_KEY=""
  - NFT_STORAGE_KEY=""
    optional for tests and deploy :
  - PRIVATE_KEY_0_DEPLOY=""
  - ALCHEMY_API_KEY=""
  - THEGRAPH_KEY=""
  - ETHERSCAN_API_KEY=""
  - ETHERSCAN_API_KEY_AVALANCHE=""
  - ETHERSCAN_API_KEY_POLYGON=""
  - ETHERSCAN_API_KEY_FANTOM=""
  - ETHERSCAN_API_KEY_BINANCE=""

  You can get API_KEYs free from different providers

  Use .env.example to start with [Example.file](./.env.example)

  _PRIVATE_KEY_0_DEPLOY is a private keys that requires some token in order to deploy smartcontracts, be carefull to not share this key on the github repo._

- **PNPM** package manager : [homepage](https://github.com/pnpm/pnpm)

  Install latest version, can be done via this command
  `curl -f https://get.pnpm.io/v6.js | node - add --global pnpm`

  For your convenience, you can also add at the end of your ~/zshrc : `alias npm=pnpm`
  to keep typing `npm` instead of `pnpm`

### Access GitHub Action

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml)

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml)
