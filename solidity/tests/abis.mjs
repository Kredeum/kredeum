// npx mocha abis.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";

import { configNetworks, configContracts, abis, getProvider } from "../../lib/config.mjs";

describe("ABIs", function () {
  it(`Should have same ABI than in config`, function () {
    configContracts.forEach(async (contract) => {
      const address = contract.address;
      const network = configNetworks.find((_network) => _network.chainName === contract.network);
      const provider = getProvider(network);

      let abi = [];
      contract.interfaces.forEach((iface) => {
        abi = abi.concat(abis[iface]);
      });

      const openNFTs = new ethers.Contract(address, abi, provider);

      // console.log("contract", contract);
      // console.log(JSON.stringify(abi, null, 2));
      console.log(`${address}@${network.chainName}:${contract.name} ${JSON.stringify(contract.interfaces)}`);

      expect(JSON.stringify(openNFTs.interface.format(["json"]))).to.be.equal(JSON.stringify(abi));
    });
  });
});
