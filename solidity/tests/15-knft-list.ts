import type { Network, Collection } from "../../lib/ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../types/OpenNFTs";

import { nftList, nftListFromTheGraph, nftListFromContract, nftListFromCovalent } from "../../lib/knft-list";
import { expect } from "chai";
import { ethers, deployments, getChainId } from "hardhat";
import { collectionGet, collectionGetMetadata } from "../../lib/kcollection-get";
import { getNetwork } from "../../lib/kconfig";

const txOptions = {
  maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  type: 2
};
let contract: string;
let chainId: number;
let networkConfig: Network | undefined;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("15 List NFTs lib", function () {
  beforeEach(async () => {
    chainId = Number(await getChainId());
    networkConfig = getNetwork(chainId);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    const openNFTs: OpenNFTs = await ethers.getContract("OpenNFTs");
    await ((await openNFTs.mint(artistAddress, "", txOptions)) as TransactionResponse).wait();

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

    before(async () => {
      collection = await collectionGetMetadata(chainId, collectionGet(chainId, contract), ethers.provider);
      console.log("collection", collection);
    });

    it("With SmartContract", async function () {
      expect((await nftListFromContract(chainId, collection, ethers.provider, artistAddress, 9)).size).to.be.gte(1);
    });

    it("With default method", async function () {
      expect((await nftList(chainId, collection, ethers.provider, artistAddress, 9)).size).to.be.gte(1);
    });

    it("With TheGraph", async function () {
      if (networkConfig?.subgraph) {
        expect((await nftListFromTheGraph(chainId, collection)).size).to.be.gte(1);
      }
    });

    it("With Covalent", async function () {
      if (networkConfig?.covalent) {
        expect((await nftListFromCovalent(chainId, collection)).size).to.be.gte(1);
      }
    });
  });
});
