#! /bin/zsh

source .env
ETH_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_API_KEY
export ETH_RPC_URL

cast chain 

cast call 0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800 "owner()(address)"
cast call 0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800 "implementationsCount()(uint256)"

# cast call 0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800 "balancesOf(address)(tuple(address,uint256,address,string,string,uint256)[])" 0x981ab0D817710d8FFFC5693383C00D985A3BDa38
# cast call 0xD5dA0F2bf1029c64460e4e1CE1fA0f88E7E39800 "balanceOf(address,address)(tuple(address,uint256,address,string,string,uint256)[])" 0x82a398243EBc2CB26a4A21B9427EC6Db8c224471 0x981ab0D817710d8FFFC5693383C00D985A3BDa38
