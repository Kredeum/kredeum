import { Deployment } from ".pnpm/hardhat-deploy@0.8.11_hardhat@2.6.1/node_modules/hardhat-deploy/dist/types";
import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { CloneFactory } from "../artifacts/types/CloneFactory";

describe("Clone Factory", function () {
  let cloneFactory: CloneFactory;

  beforeEach(async () => {
    await deployments.fixture(["CloneFactory"]);

    cloneFactory = await ethers.getContract("CloneFactory");
  });

  describe("Setup", function () {
    it("Should deploy", async function () {
      expect(cloneFactory.address).to.be.properAddress;
    });

    it("Should get deployer as owner", async function () {
      const deployer = await ethers.getNamedSigner("deployer");

      expect(await cloneFactory.owner()).to.be.equal(deployer.address);
    });

    it("Should get no version at start", async function () {
      expect(await cloneFactory.version()).to.be.equal(0);
    });
  });

  describe("Template", function () {
    it("Should set template", async function () {
      const { OpenNFTs } = await deployments.fixture(["OpenNFTs"]);
      await (await cloneFactory.setTemplate(OpenNFTs.address)).wait();

      expect(await cloneFactory.version()).to.be.equal(1);
      expect(await cloneFactory.template()).to.be.properAddress;
    });
  });

  describe("Clone", function () {
    beforeEach(async () => {
      const { OpenNFTs } = await deployments.fixture(["OpenNFTs"]);
      await (await cloneFactory.setTemplate(OpenNFTs.address)).wait();
    });

    it("Should clone template", async function () {
      await (await cloneFactory.clone()).wait();

      expect(await cloneFactory.version()).to.be.equal(1);
    });
  });
});
