# Kredeum NFTs

## Installation

Before installation, you need "node" and "pnpm" installed and a ".env" file setup
(_go to [pre-installation instructions](#pre-installation)_)

### Building Dapp and Plugin : `pnpm build`

### Running the Dapp : `pnpm dapp`

### Running the Plugin :

Install WordPress locally and link `wordpress/kredeum-nfts` inside the plugin directory of your WordPress installation

Open your WordPress BackOffice with some URL like http://localhost:8000/wp-admin/admin.php?page=nfts

## Modules :

Kredeum Factory is splitted in various modules listed bellow :

1. wordPress : WordPress Plugin
1. hardhat : Hardhat smartcontrats environment
1. gulp : Gulp static UI builder
1. rollup : Rollup for Svelte dynamic UI builder
1. thegraph : The Graph subgraph to index NFTs
1. common : Common library, config and other common datas
1. misc : Other tools, datas and archives (old)

In each of these specific directories you will access more advanced commands

## GitHub Action

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/build-dapp.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/build-dapp.yml)

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml)

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
