import type { NetworkType, CollectionType } from "@lib/common/ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTsV3 } from "@soltypes/contracts";

import { nftList, nftListFromContract } from "@lib/nft/knft-list";

import { covalentNftList } from "@lib/apis/api-covalent";
import { thegraphNftList } from "@lib/apis/api-thegraph";

import { expect } from "chai";
import { ethers, deployments, getChainId } from "hardhat";
import { collectionGet } from "@lib/collection/kcollection-get";
import { getNetwork } from "@lib/common/kconfig";

import fetch from "node-fetch";
global.fetch = fetch as any;

const txOptions = {
  maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  type: 2
};
let chainId: number;
let networkConfig: NetworkType | undefined;
let openNFTsV3: OpenNFTsV3;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
const jsonURI = "https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624";

describe("32 List OpenNFTsV3 lib", function () {
  beforeEach(async () => {
    chainId = Number(await getChainId());
    networkConfig = getNetwork(chainId);
    // console.log("beforeEach ~ networkConfig", networkConfig);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV3"]);
    }
    openNFTsV3 = (await ethers.getContract("OpenNFTsV3")) as unknown as OpenNFTsV3;
    await ((await openNFTsV3.mintOpenNFT(artistAddress, jsonURI, txOptions)) as TransactionResponse).wait();

    // console.log("totalSupply", (await openNFTsV3.totalSupply()).toNumber());
    // console.log(chainId, openNFTsV3.address);
  });

  describe("Setup", function () {
    it("Should get OpenNFTsV3 contract address", function () {
      expect(openNFTsV3.address).to.be.properAddress;
    });
  });

  describe("List NFTs", function () {
    this.timeout(50000);
    let collection: CollectionType;

    before(async () => {
      collection = await collectionGet(chainId, openNFTsV3.address, ethers.provider);
      // console.log("collection", collection);
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
