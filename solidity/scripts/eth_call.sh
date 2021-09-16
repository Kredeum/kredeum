#!/bin/zsh

function curlEth () {
  echo
  echo $DATA | jq 
  RES=$(curl -s -X POST -H "Content-Type: application/json" $URL --data $DATA)
  echo $RES | jq
}

source ./.env

URL=https://rinkeby.infura.io/v3/$INFURA_API_KEY
# URL=https://eth-rinkeby.alchemyapi.io/v2/$ALCHEMY_API_KEY
echo $URL

# DATA='{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":0}'
# curlEth

# DATA='{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x981ab0D817710d8FFFC5693383C00D985A3BDa38", "latest"],"id":0}'
# curlEth 
# echo $RES | jq -r .result | xargs printf "%d\n"


DATA='{"jsonrpc":"2.0","method":"eth_call","params":[
{
  "from": "0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c",
  "to": "0x93B26e23d6a62149CCD1fB8E426B0947Fc1955De",
  "data": "0x6392a51f000000000000000000000000981ab0d817710d8fffc5693383c00d985a3bda38"
},
"latest"],"id":1}'
curlEth 
# echo $RES | jq -r .result | xargs printf "%d\n"

# "data": "0xf7888aec0000000000000000000000002cfd2795c82887bd49a5c27c7868040086694167000000000000000000000000981ab0d817710d8fffc5693383c00d985a3bda38"

# "from":"0x981ab0D817710d8FFFC5693383C00D985A3BDa38",
# "accessList": null
# "chainId":"0x4",
