import type { Signer } from "ethers";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";
import type { OpenNFTsV2 } from "types/OpenNFTsV2";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("10 Clone Factory contract", function () {
  let nftsFactoryV2: NFTsFactoryV2;
  let openNFTsV3: OpenNFTsV3;
  let openNFTsV2: OpenNFTsV2;
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
      await deployments.fixture(["NFTsFactoryV2", "OpenNFTsV2", "OpenNFTsV3"]);
    }
    nftsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    openNFTsV2 = await ethers.getContract("OpenNFTsV2");
  });

  describe("Setup", function () {
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
  });

  describe("Set implementations", function () {
    it("Should add implementation", async function () {
      await expect(nftsFactoryV2.connect(deployer).implementationsAdd([openNFTsV3.address]))
        .to.emit(nftsFactoryV2, "ImplementationNew")
        .withArgs(openNFTsV3.address, deployerAddress, 1);

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should set Template", async function () {
      await expect(nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address))
        .to.emit(nftsFactoryV2, "TemplateNew")
        .withArgs(openNFTsV3.address, "generic");
    });

    it("Should set template and clone", async function () {
      await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "generic")).to.emit(
        nftsFactoryV2,
        "ImplementationNew"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should set older template and clone", async function () {
      await nftsFactoryV2.connect(deployer).templateSet("older", openNFTsV2.address);
      await expect(nftsFactoryV2.connect(deployer).clone("Old NFT collection", "OLD", "older")).to.emit(
        nftsFactoryV2,
        "ImplementationNew"
      );

      expect(await nftsFactoryV2.implementationsCount()).to.be.equal(1);
    });

    it("Should not clone template not contract", async function () {
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "random")).to.be.revertedWith(
        "Bad Template"
      );
    });

    it("Should not clone template not OpenNFTsV3 contract", async function () {
      await expect(nftsFactoryV2.connect(deployer).clone("NFT collection", "COLL", "random")).to.be.revertedWith(
        "Bad Template"
      );
    });
  });
});
