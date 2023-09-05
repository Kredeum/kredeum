#! /bin/zsh

source .env
export FOUNDRY_ETH_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY_POLYGON
export CONTRACT0=0xF6d53C7e96696391Bb8e73bE75629B37439938AF

export CONTRACT=${1-$CONTRACT0}

echo TEST ERC on $CONTRACT
echo -n "Invalid              "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0xffffffff
echo -n "ERC165               "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x01ffc9a7 
echo -n "ERC721               "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x80ac58cd 
echo -n "ERC721Metadata       "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x5b5e139f 
echo -n "ERC721Enumerable     "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x780e9d63 
echo -n "ERC721TokenReceiver  "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x150b7a02 
echo -n "ERC1155              "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0xd9b67a26 
echo -n "ERC1155MetadataURI   "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x0e89341c 
echo -n "ERC1155TokenReceiver "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x4e2312e0 
echo -n "ERC173               "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x7f5828d0 
echo -n "ERC2981              "
cast call $CONTRACT "supportsInterface(bytes4)(bool)" 0x2a55205a 
