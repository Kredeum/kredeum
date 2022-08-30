#! /bin/zsh

source .env

export MAINNET_ALCHEMY_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_API_KEY
export POLYGON_ALCHEMY_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY_POLYGON
export GOERLI_ALCHEMY_RPC_URL=https://eth-goerli.g.alchemy.com/v2/$ALCHEMY_API_KEY_GOERLI

export FOUNDRY_ETH_RPC_URL=$GOERLI_ALCHEMY_RPC_URL
echo $FOUNDRY_ETH_RPC_URL


export GOERLI_RESOLVER=0xAeDBbFd9A6D366f77640d4AE9715e639e1Cd091a

export CONTRACT=$GOERLI_RESOLVER


cast call $CONTRACT "countAddresses()"  

cast call $CONTRACT "getOpenNFTsCollectionsInfos(address)"  0x981ab0D817710d8FFFC5693383C00D985A3BDa38

cast call $CONTRACT "getOpenNFTsCollectionsInfos(address)"  0xb09Ae31E045Bb9d8D74BB6624FeEB18B3Af72A8e

# CRASH
cast call $CONTRACT "getOpenNFTsCollectionsInfos(address)"  0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c
