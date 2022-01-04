import type { Signer } from "ethers";
import type { CloneFactory } from "../types/CloneFactory";
import type { OpenNFTs } from "../types/OpenNFTs";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("Clone Factory contract", function () {
  let cloneFactory: CloneFactory;
  let openNFTs: OpenNFTs;
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
      await deployments.fixture(["CloneFactory", "OpenNFTs"]);
    }
    cloneFactory = await ethers.getContract("CloneFactory");
    openNFTs = await ethers.getContract("OpenNFTs");

    await (await cloneFactory.setDefaultTemplate(openNFTs.address)).wait();
  });

  describe("Setup", function () {
    it("Should deploy", function () {
      expect(cloneFactory.address).to.be.properAddress;
    });

    it("Should get deployer as owner", async function () {
      expect(await cloneFactory.owner()).to.be.equal(deployerAddress);
    });

    it("Should transfer ownership", async function () {
      await cloneFactory.transferOwnership(tester1Address);

      expect(await cloneFactory.owner()).to.be.equal(tester1Address);
    });

    it("Should renounce ownership", async function () {
      await cloneFactory.renounceOwnership();
      expect(await cloneFactory.owner()).to.be.equal(zeroAddress);
    });
  });

  describe("Template", function () {
    it("Should set template", async function () {
      expect(await cloneFactory.template()).to.be.equal(openNFTs.address);
    });

    it("Should be a template", async function () {
      expect(await cloneFactory.templates(openNFTs.address)).to.be.equal(openNFTs.address);
    });

    it("Should give at least 1 implementation: the default template", async function () {
      expect(await cloneFactory.implementationsCount()).to.be.gte(1);
    });
  });
});
