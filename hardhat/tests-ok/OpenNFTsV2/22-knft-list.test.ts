import type { NetworkType, CollectionType } from "lib/ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTsV2 } from "types/OpenNFTsV2";

import { nftList, nftListFromContract } from "lib/knft-list";

import { covalentNftList } from "lib/api-covalent";
import { thegraphNftList } from "lib/api-thegraph";

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
let networkConfig: NetworkType | undefined;
let openNFTsV2: OpenNFTsV2;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
const jsonURI = "https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624";

describe("22 List OpenNFTsV2 lib", function () {
  beforeEach(async () => {
    chainId = Number(await getChainId());
    networkConfig = getNetwork(chainId);
    console.log("beforeEach ~ networkConfig", networkConfig);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV2"]);
    }
    openNFTsV2 = (await ethers.getContract("OpenNFTsV2")) as unknown as OpenNFTsV2;
    await ((await openNFTsV2.mintNFT(artistAddress, jsonURI, txOptions)) as TransactionResponse).wait();

    console.log("totalSupply", (await openNFTsV2.totalSupply()).toNumber());
    // console.log(chainId, openNFTsV2.address);
  });

  describe("Setup", function () {
    it("Should get OpenNFTsV2 contract address", function () {
      expect(openNFTsV2.address).to.be.properAddress;
    });
  });

  describe("List NFTs", function () {
    this.timeout(50000);
    let collection: CollectionType;

    before(async () => {
      collection = await collectionGet(chainId, openNFTsV2.address, ethers.provider);
      console.log("collection", collection);
    });

    it("With SmartContract", async function () {
      expect(
        (await nftListFromContract(chainId, collection.address, ethers.provider, collection, artistAddress, 9)).size
      ).to.be.gte(1);
    });

    it("With default method", async function () {
      expect(
        (await nftList(chainId, collection.address, ethers.provider, collection, artistAddress, 9)).size
      ).to.be.gte(1);
    });

    it("With TheGraph", async function () {
      if (networkConfig?.subgraph) {
        expect((await thegraphNftList(chainId, collection)).size).to.be.gte(1);
      }
    });

    it("With Covalent", async function () {
      if (networkConfig?.covalent) {
        expect((await covalentNftList(chainId, collection)).size).to.be.gte(1);
      }
    });
  });
});
