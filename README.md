# Kredeum NFTs

## Instructions

_Before installation, you need `node`, `pnpm`, some `environment` variables and a local `WordPress` (for plugin only). For detailed instructions, check [pre-installation section](#pre-installation)._


First install npm packages:
```
pnpm install
```

To launch Dapp in `dev` mode:
```
pnpm dev:dapp
```

To build Dapp, then launch it in `production` mode:
```
pnpm build:dapp
pnpm preview:dapp
```

To build WP Plugin, then lauch it inside your browser:
```
pnpm build:plugin
open http://localhost:8000/wp-admin/admin.php?page=nfts
```

## Modules :

Kredeum Factory is splitted in various modules listed bellow :

1. sveltekit : SvelteKit main app (svelte)
1. svelte : Svelte UI components (svelte)
1. contracts : Smartcontrats (solidity)
1. wordpress : WordPress Kredeum NFTs Factory Plugin (PHP/js)
1. gulp : Static UI (html, css)
1. config : Configuration files with network settings (json)
1. common : Common libraries (typescript)
1. misc : Other tools, datas and archives

In each of these specific directories you will access more advanced commands

## GitHub Action

[![Deploy to WordPress.org](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml/badge.svg)](https://github.com/Kredeum/kredeum/actions/workflows/wordpress-deploy.yml)

## Pre installation

- **NODE** v20 :
  Install node v20, for example via  [node download page](https://nodejs.org/en/download/) or with **brew** (on MacOS):
  ```
  brew install node
  ```

- **PNPM** package manager :
  Install via `pnpm installation page` : https://pnpm.io/fr/installation
  <br />

- **ENV**  environment variables :
  You have to keep these variables in your environment

  - INFURA_API_KEY=""
  - COVALENT_API_KEY=""
  - NFT_STORAGE_KEY=""

  You can get free API_KEYs from these different providers

  You can use `.env.example` to start with, it also includes optional environment variables for deployments.  Then you can `source` or `sh` your `.env` file (to set these variables in your environment) before running `pnpm` tasks.
  Another option can be to use [direnv](https://direnv.net/) to automatically load these variables.
  <br />

- **WORDPRESS**
 To iInstall WordPress locally, we higly recommend [Local WP](https://localwp.com/)

Then link `wordpress/kredeum-nfts` directory of this repo to the plugin directory of your WordPress installation:
 ```
 ln -s /path/to/this/repo/wordpress/kredeum-nfts /path/to/your/wordpress/wp-content/plugins/kredeum-nfts
 ```

