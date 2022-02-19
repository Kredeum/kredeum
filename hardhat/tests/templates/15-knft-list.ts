import type { Network, Collection } from "lib/ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

import { nftList, nftListFromTheGraph, nftListFromContract, nftListFromCovalent } from "lib/knft-list";
import { expect } from "chai";
import { ethers, deployments, getChainId } from "hardhat";
import { collectionGet } from "lib/kcollection-get";
import { getNetwork } from "lib/kconfig";

import fetch from "node-fetch";
global.fetch = fetch as any;

const txOptions = {
  maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  type: 2
};
let chainId: number;
let networkConfig: Network | undefined;
let openNFTsV3: OpenNFTsV3;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
const jsonURI = "https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624";

describe("15 List NFTs lib", function () {
  beforeEach(async () => {
    chainId = Number(await getChainId());
    networkConfig = getNetwork(chainId);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV3"]);
    }
    openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    await ((await openNFTsV3.mintNFT(artistAddress, jsonURI, txOptions)) as TransactionResponse).wait();

    console.log("totalSupply", (await openNFTsV3.totalSupply()).toNumber());
    // console.log(chainId, openNFTsV3.address);
  });

  describe("Setup", function () {
    it("Should get OpenNFTsV3 contract address", function () {
      expect(openNFTsV3.address).to.be.properAddress;
    });
  });

  describe("List NFTs", function () {
    this.timeout(50000);
    let collection: Collection;

    before(async () => {
      collection = await collectionGet(chainId, openNFTsV3.address, ethers.provider);
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
