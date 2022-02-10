# Kredeum NFTs

## Installation

After [pre-installation](./PRE_INSTALL.md), installation process is quite simple :

- `npm install && npm run build`

In case of a re-installation, launch `npm run clean` before

## Running the Dapp

You can run the DAPP via this command , :

- `npm run dapp-dev`

and then go to http://localhost:5000

## Running the Plugin

In order to run the plugin you need a WordPress installation on your local disk
and link `wordpress/kredeum-nfts` inside the pugin directory of your WordPress installation

Then, you have to rebuild the js lib, after each modification, to take effect :

- `npm run wp-build-js`

that will rebuild the js library and copy it to `wordpress/kredeum-nfts/lib/js/kredeum-nfts.js`

## More advanced commands

#### Kredeum NFTs is splitted in 4 modules:

1. WordPress (wp) : one or more WordPress Plugin
1. Solidity (smart) : one or more Solidity ERC721 smartcontrats
1. Dapp (dapp) : UI to access NFTs wallet (independently, outside of Wordpress)
1. Subgraphs (sub) : subgraph deployments to index all NFTs on different blockchain

#### Development Workflow is splitted in these following Steps :

1. Install
1. Build
1. Check
1. Tests
1. Deploy
1. Clean

**Each workflow can be launched on each module, or globally via the "npm" command , for example:**

- `npm smart-build` build on smart module
- `npm wp-tests` tests ob wordpress module
- `npm check` source checks on all modules

Check package.json, for more specific scripts

### Global module

- "all" : install all after cleanup
- "clean" : cleanup the repo
- "install" : install the repo
- "build": build the repo
- "check" : check the repo, beautifier + eslint checkin
- "test" : run some test on the repo

### Solidity module

- "smart-clean" : cleanup the solidity smartcontract module
- "smart-build" : compile all the solidity files
- "smart-check" : check the solidity smartcontract module
- "smart-flatten" : flatten the Kredeum NFTs smartcontract in one file
- "smart-deploy" : deploy the Kredeum NFTs smartcontract
- "smart-deploy-mumbai" : deploy the Kredeum NFTs smartcontract to mumbai network
- "smart-deploy-matic" : deploy the Kredeum NFTs smartcontract to matic network
- "smart-list" : list all Kredeum NFTs smartcontract

### Dapp module

- "dapp-clean" : cleanup the dapp module
- "dapp-build" : build dapp
- "dapp-build-dev" : run Dapp in dev mode
- "dapp-check" : check dapp
- "dapp-start" : run Dapp in build mode

### Wordpress module

- "wp-clean" : cleanup the WordPress module
- "wp-install" : install wordpress depedencies
- "wp-build-txt" : build/pre-process wordpress readme txt
- "wp-build-php" : build/pre-process wordpress php
- "wp-build-vendor" : build depedencies
- "wp-build-js": build Kredeum NFTs webcomponent and install on Wordpress
- "wp-build": build WordPress Plugin
- "wp-format" : format the wordpress module
- "wp-fix": fix wordpress errors
- "wp-check": check the repo, format + fix checking
- "wp-dev": run wordpress dev

### Subgraph module

- "sub-clean" : cleanup the Subgraph module
- "sub-build-yaml-matic" : build matic subraph.yaml file
- "sub-build-yaml-mumbai": build mumbai subraph.yaml file
- "sub-build-codegen": run `graph codegen` on subgraph.yaml and abis
- "sub-build-subgraph": run `graph build`
- "sub-build": build the subgraph module
- "sub-check": check the subgraph module
- "sub-deploy": deploy the subgraph module on default network (matic)
- "sub-deploy-mumbai": deploy the subgraph module on mumbai

### Access GitHub Action

[![Check sources](https://github.com/Kredeum/kredeum/actions/workflows/check.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/check.yml)

[![Test sources](https://github.com/Kredeum/kredeum/actions/workflows/tests.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/tests.yml)

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress.yml)
