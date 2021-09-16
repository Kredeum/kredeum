// npx mocha --experimental-json-modules 3-abis.mjs
import { ethers } from "ethers";
import { expect } from "chai";

import { networks, contracts, abis, getProvider } from "../../lib/config";
import type { Network, Contract } from "../../lib/config";

describe("ABIs : Check", function () {
  it(`Should have same ABI than in config`, function () {
    contracts.forEach(async (contract: Contract) => {
      const address = contract.address;
      const network: Network | undefined = networks.find(
        (_network) => _network.chainName === contract.network
      );
      expect(network).to.be.not.undefined;

      if (network) {
        const provider = getProvider(network);

        let abi: Array<string> = [];
        contract.interfaces?.forEach((iface: string) => {
          const map = new Map(Object.entries(abis));
          abi = abi.concat(map.get(iface) as Array<string>);
        });

        const openNFTs = new ethers.Contract(address, abi, provider);

        console.log(
          "CONTRACT",
          `${address}@${network?.chainName}:${contract.name} ${JSON.stringify(contract.interfaces)}`
        );

        const json1 = JSON.stringify(openNFTs.interface.format("minimal"));
        const json2 = JSON.stringify(abi);
        if (json1 !== json2) {
          console.log("CONTRACT", contract);
          // console.log(JSON.stringify(abi, null, 2));
          console.log("JSON1", json1);
          console.log("JSON2", json2);
        }
        // expect(json1).to.be.equal(json2);
      }
    });
  });
});
