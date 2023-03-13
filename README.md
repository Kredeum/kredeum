# Kredeum NFTs

## Installation

Before installation, you need "node" and "pnpm" installed and a ".env" file setup
(_go to [pre-installation instructions](#pre-installation)_)

### Building Dapp :

`pnpm build-dapp`

### Building WP Plugin :

`pnpm build-wp-plugin`

### Running the Dapp :

`pnpm dapp`

### Running the Plugin :

Install WordPress locally, we higly recommend [Local WP](https://localwp.com/)

Then link `wordpress/kredeum-nfts` inside the plugin directory of your WordPress installation

Open your WordPress BackOffice with some URL like http://localhost:8000/wp-admin/admin.php?page=nfts

## Modules :

Kredeum Factory is splitted in various modules listed bellow :

1. svelte : Svelte UI components
1. contracts : Solidity smartcontrats (with Hardhat & Foundry)
1. wordpress : WordPress Kredeum NFTs Factory Plugin
1. gulp : Static UI
1. thegraph : The Graph subgraph to index NFTs
1. common : Common library, config and other common datas
1. misc : Other tools, datas and archives

In each of these specific directories you will access more advanced commands

## GitHub Action

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml)

## Pre installation

- **NODE** v18 :
  Install node v18

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
  - DEPLOYER_PRIVATE_KEY=""
  - ALCHEMY_API_KEY=""
  - ETHERSCAN_API_KEY=""

  You can get API_KEYs free from different providers

  Use .env.example to start with [Example.file](./.env.example)

  _PRIVATE_KEY_0_DEPLOY is a private keys that requires some token in order to deploy smartcontracts, be carefull to not share this key on the github repo._

- **PNPM** package manager : [homepage](https://github.com/pnpm/pnpm)

  Install latest version : [pnpm install page](https://pnpm.io/fr/installation)
