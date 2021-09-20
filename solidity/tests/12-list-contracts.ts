import {
  listContracts,
  listContractsFromCache,
  listContractsFromCovalent,
  listContractsFromTheGraph,
  listContractsFromFactory,
  listContractsFromConfig
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
      expect((await listContracts(chainId1, owner)).length).to.be.gt(1);
    });
  });

  describe("Internal functions", async function () {
    beforeEach(async () => {
      network = getNetwork(chainId1);
    });

    it("List with The Graph", async function () {
      expect((await listContractsFromTheGraph(network, owner)).size).to.be.gt(1);
    });

    it("List with NFTsFactory", async function () {
      expect((await listContractsFromFactory(network, owner)).size).to.be.gt(1);
    });

    it("List with config", async function () {
      expect((await listContractsFromConfig(network)).size).to.be.gt(1);
    });

    it.skip("With Covalent", async function () {
      expect((await listContractsFromCovalent(network, owner)).size).to.be.gt(1);
    });

    it.skip("Both methods should give same results", async function () {
      expect((await listContractsFromTheGraph(network, owner)).size).to.be.equal(
        (await listContractsFromCovalent(network, owner)).size
      );
    });
  });
});
