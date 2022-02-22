import type { Signer } from "ethers";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { OpenNFTsV1 } from "types/OpenNFTsV1";
import type { OpenNFTsV2 } from "types/OpenNFTsV2";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("10 Clone Factory contract", function () {
  let nftsFactoryV2: NFTsFactoryV2;
  let openNFTsV1: OpenNFTsV2;
  let openNFTsV2: OpenNFTsV2;
  let openNFTsV3: OpenNFTsV3;
  let tester1: Signer;
  let deployer: Signer;
  let tester1Address: string;
  let deployerAddress: string;
  this.timeout(60000);

  beforeEach(async () => {
    ({ deployer, tester1 } = await ethers.getNamedSigners());
    deployerAddress = await deployer.getAddress();
    tester1Address = await tester1.getAddress();

    if ((await ethers.provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["NFTsFactoryV2", "OpenNFTsV1", "OpenNFTsV2", "OpenNFTsV3"]);
    }
    nftsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    openNFTsV1 = await ethers.getContract("OpenNFTsV1");
    openNFTsV2 = await ethers.getContract("OpenNFTsV2");
    openNFTsV3 = await ethers.getContract("OpenNFTsV3");
  });

  describe("Should Setup", function () {
    it("Should deploy", function () {
      expect(nftsFactoryV2.address).to.be.properAddress;
    });

    it("Should get deployer as owner", async function () {
      expect(await nftsFactoryV2.owner()).to.be.equal(deployerAddress);
    });

    it("Should transfer ownership", async function () {
      await nftsFactoryV2.transferOwnership(tester1Address);
      expect(await nftsFactoryV2.owner()).to.be.equal(tester1Address);
    });

    it("Should renounce ownership", async function () {
      await nftsFactoryV2.renounceOwnership();
      expect(await nftsFactoryV2.owner()).to.be.equal(zeroAddress);
    });

    it("Should have no implementations", async function () {
      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(0);
    });

    it("Should get version 2", async function () {
      expect(await nftsFactoryV2.version()).to.be.equal(2);
    });
  });

  describe("Should Add Implementations", function () {
    it("Should Add Implementation", async function () {
      await expect(nftsFactoryV2.connect(deployer).implementationsAdd([openNFTsV3.address]))
        .to.emit(nftsFactoryV2, "ImplementationNew")
        .withArgs(openNFTsV3.address, deployerAddress, 1);

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should Add Old Implementation", async function () {
      await expect(nftsFactoryV2.connect(deployer).implementationsAdd([openNFTsV2.address]))
        .to.emit(nftsFactoryV2, "ImplementationNew")
        .withArgs(openNFTsV2.address, deployerAddress, 1);

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should not Add Implementation if Not Owner", async function () {
      await expect(nftsFactoryV2.connect(tester1).implementationsAdd([openNFTsV3.address])).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(0);
    });

    it("Should not Add Implementation if Not ERC721", async function () {
      await expect(nftsFactoryV2.connect(deployer).implementationsAdd([nftsFactoryV2.address])).to.be.revertedWith(
        "Implementation not ERC721 contract"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(0);
    });
  });

  describe("Should Set Template", function () {
    it("Should Set Template", async function () {
      await expect(nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address))
        .to.emit(nftsFactoryV2, "TemplateNew")
        .withArgs(openNFTsV3.address, "generic");

      expect(await nftsFactoryV2.templates("generic")).to.be.equal(openNFTsV3.address);
    });

    it("Should Not Set Template if Not Owner", async function () {
      await expect(nftsFactoryV2.connect(tester1).templateSet("generic", openNFTsV3.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );

      expect(await nftsFactoryV2.templates("generic")).to.be.equal(zeroAddress);
    });

    it("Should Not Set Template if Not ERC721", async function () {
      await expect(nftsFactoryV2.connect(deployer).templateSet("generic", nftsFactoryV2.address)).to.be.revertedWith(
        "Template not ERC721 contract"
      );

      expect(await nftsFactoryV2.templates("generic")).to.be.equal(zeroAddress);
    });
  });

  describe("Should Clone", function () {
    it("Should Clone", async function () {
      await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "generic")).to.emit(
        nftsFactoryV2,
        "ImplementationNew"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should Clone Old Template", async function () {
      await nftsFactoryV2.connect(deployer).templateSet("older", openNFTsV2.address);
      await expect(nftsFactoryV2.connect(deployer).clone("Old NFT collection", "OLD", "older")).to.emit(
        nftsFactoryV2,
        "ImplementationNew"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should Not Clone inexistant Template Name", async function () {
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "random")).to.be.revertedWith(
        "Bad Template"
      );
    });

    it("Should Not Clone Template non OpenNFTs V2 or V3 contract", async function () {
      await nftsFactoryV2.connect(deployer).templateSet("notv1v2", openNFTsV1.address);
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "notv1v2")).to.be.revertedWith(
        "Template not OpenNFTs V2 or V3 contract"
      );
    });
  });
});
