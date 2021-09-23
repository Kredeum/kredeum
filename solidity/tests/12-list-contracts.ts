import {
  listContracts,
  listContractsFromCache,
  listContractsFromCovalent,
  listContractsFromTheGraph,
  listContractsFromFactory
} from "../../lib/nfts-factory";
import type { Network, Contract } from "../../lib/ktypes";
import { getNetwork } from "../../lib/kconfig";
import { expect } from "chai";
import fetch from "node-fetch";
global.fetch = fetch as any;

describe("NFTsContracts", async function () {
  const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
  const chainId1 = "0x13881";
  let network: Network;

  describe("Public functions", async function () {
    it("List with default method", async function () {
      console.log((await listContracts(chainId1, owner)).length);
      expect((await listContracts(chainId1, owner)).length).to.be.gt(1);
    });
  });

  describe("Internal functions", async function () {
    beforeEach(async () => {
      network = getNetwork(chainId1);
    });

    it("List with The Graph", async function () {
      expect((await listContractsFromTheGraph(chainId1, owner)).size).to.be.gt(1);
    });

    it.skip("List with NFTsFactory", async function () {
      expect((await listContractsFromFactory(chainId1, owner)).size).to.be.gt(1);
    });

    it.skip("With Covalent", async function () {
      expect((await listContractsFromCovalent(chainId1, owner)).size).to.be.gt(1);
    });

    it.skip("Both methods should give same results", async function () {
      expect((await listContractsFromTheGraph(chainId1, owner)).size).to.be.equal(
        (await listContractsFromCovalent(chainId1, owner)).size
      );
    });
  });
});
