import type { Network, Collection } from "../../lib/ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../types/OpenNFTs";

import {
  nftList,
  nftListFromTheGraph,
  nftListFromContract,
  nftListFromCovalent
} from "../../lib/knft-list";
import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { getNetwork } from "../../lib/kconfig";
import { collectionGet } from "../../lib/kcollection-get";

const txOptions = {
  maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  type: 2
};
let contract: string;
let chainId: number;
let network: Network | undefined;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("List NFTs lib", function () {
  beforeEach(async () => {
    chainId = (await ethers.provider.getNetwork()).chainId;
    network = getNetwork(chainId);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    const openNFTs: OpenNFTs = await ethers.getContract("OpenNFTs");
    await ((await openNFTs.mintNFT(artistAddress, "", txOptions)) as TransactionResponse).wait();

    contract = openNFTs.address;

    console.log("totalSupply", (await openNFTs.totalSupply()).toNumber());
    // console.log(chainId, contract);
  });

  describe("Setup", function () {
    it("Should get OpenNFTs contract address", function () {
      expect(contract).to.be.properAddress;
    });
  });

  describe("List NFTs", function () {
    this.timeout(50000);
    let collection: Collection;

    before(() => {
      collection = collectionGet(chainId, contract);
      console.log("collection", collection);
    });

    it("With SmartContract", async function () {
      expect(
        (await nftListFromContract(chainId, collection, ethers.provider, artistAddress, 9)).size
      ).to.be.gte(1);
    });

    it("With default method", async function () {
      expect(
        (await nftList(chainId, collection, ethers.provider, artistAddress, 9)).size
      ).to.be.gte(1);
    });

    it("With TheGraph", async function () {
      if (network?.subgraph) {
        expect((await nftListFromTheGraph(chainId, collection)).size).to.be.gte(1);
      }
    });

    it("With Covalent", async function () {
      if (network?.covalent) {
        expect((await nftListFromCovalent(chainId, collection)).size).to.be.gte(1);
      }
    });
  });
});
