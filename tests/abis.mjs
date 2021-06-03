// npx mocha abis.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";
import contracts from "../config/contracts.json";
import networks from "../config/networks.json";
import abis from "../config/abis.json";

const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

describe("ABIs", function () {
  it(`Should have same ABI than in config`, function () {
    contracts.forEach(async (contract) => {
      const address = contract.address;
      const abi = abis[contract.abi];
      const network = networks.find((_network) => _network.chainName === contract.network);

      const provider = new ethers.providers.JsonRpcProvider(`${network.rpcUrls[0]}/${MATICVIGIL_API_KEY}`);
      const openNFTs = new ethers.Contract(address, abi, provider);

      // console.log(`${contract.abi}:${address}@${network.chainName}`);

      expect(JSON.stringify(openNFTs.interface.format(["json"]))).to.be.equal(JSON.stringify(abis[contract.abi]));
    });
  });
});
