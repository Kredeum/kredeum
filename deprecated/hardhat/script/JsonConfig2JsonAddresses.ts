/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { isAddress } from "@ethersproject/address";
import networks from "@config/networks.json";
import jsonAddresses from "../addresses.json";
import { writeFileSync } from "fs";

// not working without !
const addresses = JSON.parse(JSON.stringify(jsonAddresses));

for (const network of networks) {
  if (network.mainnet) {
    const chainId = String(network.chainId);
    console.log(chainId, network.chainName);

    let ko = false;

    console.log(`networks "${chainId}": {`);
    for (let [key, value] of Object.entries(network)) {
      if (isAddress(value)) {
        console.log(`  ${key}: "${value}",`);
        if (key == "openNFTs") key = "OpenNFTs";
        if (key == "nftsFactory") key = "OpenNFTsFactory";
        if (key == "nftsFactoryV2") key = "OpenNFTsFactoryV2";
        if (key == "nftsFactoryV3") key = "OpenNFTsFactoryV3";
        if (key == "nftsResolver") key = "OpenNFTsResolver";

        if (addresses[chainId][key] != value) {
          ko = true;
          value = "";
          console.log(key, addresses[chainId][key]);
        }
      }
    }
    console.log("}");
    if (ko) console.log(`addresses "${chainId}": `, addresses[chainId]);
  }
}
