// npx mocha abis.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";
import contracts from "../config/contracts.json";
import networks from "../config/networks.json";

const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

describe("ABIs", function () {
  it(`Should have same ABI than in config`, function () {
    for (const version in contracts) {
      const instances = contracts[version].instances;
      const abi = contracts[version].abi;
      // console.log(version, abi);

      for (const network in instances) {
        const contractList = instances[network];
        const configNetwork = networks.find((nw) => nw.chainName === network);
        // console.log(version, network, contractList);
        const provider = new ethers.providers.JsonRpcProvider(`${configNetwork.rpcUrls[0]}/${MATICVIGIL_API_KEY}`);

        const addresses = contractList.map((_contract) => _contract.address);

        addresses.forEach((address) => {
          const openNFTs = new ethers.Contract(address, abi, provider);
          console.log(`${version}:${address}@${network}`);

          expect(JSON.stringify(openNFTs.interface.format(["json"]))).to.be.equal(
            JSON.stringify(contracts[version].abi)
          );
        });
      }
    }
  });
});
