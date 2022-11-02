#! /bin/zsh

source .env
export FOUNDRY_ETH_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY_POLYGON
export CONTRACT1=0xF6d53C7e96696391Bb8e73bE75629B37439938AF
export CONTRACT2=0xf25E5A041D838Fa5bdCCa345C6CAE766c60B89a3

export CONTRACT=$CONTRACT2

# cast call $CONTRACT1 "totalSupply()(uint256)" 
# cast call $CONTRACT1 "supportsInterface(bytes4)(bool)" 0x01ffc9a7 # ERC165

echo -n "ERC165           "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x01ffc9a7 
