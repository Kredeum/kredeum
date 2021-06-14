# PRE INSTALLATION

It's mandatory to pre-install "node" and ".env" file,
and recommanded to pre-install "pnpm" and "VS-Code" with some extensions :

### MANDATORY

- **Node** v14+ :
  Install node v14 or v16

  - via this [download page](https://nodejs.org/en/download/)
  - or via **brew** on MacOS : `brew install node`

- **.env** environment file :
  You have to keep these variables secures in an environmment file .env **outside** the git repository :
  - ACCOUNT_ADDRESS
  - ACCOUNT_KEY
  - MATICVIGIL_API_KEY
  - THEGRAPH_KEY
  - NFT_STORAGE_KEY
  - and may be some others...
    [Example.file](./.env.example)
    You can get these API KEY free from different providers
    _ACCOUNT_ADDRESS and ACCOUNT_KEY are some public and private keys that requires some coins in order to interact with the blockchains. Faucet coins on the testsnets are ok and riskless, but real coins are needed on the mainnets, for specific tests and for deployments, so be carefull, and don't share these keys on the github repo._
    We recommand to put this .env file in some directory on your hard idsk (for example in `~/.secret_dir_24123`), and "source" it when launching your terminal. With zsh you can do this by adding this line at the end of your ~/zshrc : `source ~/.secret_dir_24123/.env`
    (relaunch your terminal to take this into account...)

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
