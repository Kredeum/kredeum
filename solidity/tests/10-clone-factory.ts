import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { Contract, Signer } from "ethers";
import type { CloneFactory } from "../artifacts/types/CloneFactory";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";
import { abis } from "../../lib/kconfig";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("Clone Factory", function () {
  let cloneFactory: CloneFactory;
  let openNFTs: OpenNFTs;
  let tester1: Signer;
  let deployer: Signer;
  let tester1Address: string;
  let deployerAddress: string;
  this.timeout(60000);

  before(async () => {
    ({ deployer, tester1 } = await ethers.getNamedSigners());
    deployerAddress = await deployer.getAddress();
    tester1Address = await tester1.getAddress();

    await deployments.fixture(["OpenNFTs"]);
    openNFTs = await ethers.getContract("OpenNFTs");
  });

  describe("Setup", function () {
    beforeEach(async () => {
      const factoryCloneFactory = await ethers.getContractFactory("CloneFactory");
      cloneFactory = (await factoryCloneFactory.deploy()) as CloneFactory;
    });

    it("Should deploy", async function () {
      expect(cloneFactory.address).to.be.properAddress;
    });

    it("Should get no version at start", async function () {
      expect(await cloneFactory.version()).to.be.equal(0);
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
    before(async () => {
      const factoryCloneFactory = await ethers.getContractFactory("CloneFactory");
      cloneFactory = (await factoryCloneFactory.deploy()) as CloneFactory;

      await (await cloneFactory.addTemplate(openNFTs.address)).wait();
    });

    it("Should give version 1", async function () {
      expect(await cloneFactory.version()).to.be.equal(1);
    });

    it("Should set template", async function () {
      expect(await cloneFactory.template()).to.be.equal(openNFTs.address);
    });

    it("Should give 1 template", async function () {
      const tmp = await cloneFactory.templates();
      expect(tmp.length).to.be.equal(1);
      expect(tmp[0]).to.be.equal(openNFTs.address);
    });

    it("Should give 1 implementation", async function () {
      const imp = await cloneFactory.implementations();
      expect(imp.length).to.be.equal(1);
      expect(imp[0]).to.be.equal(openNFTs.address);
    });
  });

  describe("Clone", function () {
    before(async () => {
      const factoryCloneFactory = await ethers.getContractFactory("CloneFactory");
      cloneFactory = (await factoryCloneFactory.deploy()) as CloneFactory;

      await (await cloneFactory.addTemplate(openNFTs.address)).wait();
      await (await cloneFactory.clone()).wait();
    });

    it("Should clone", async function () {
      const imp = await cloneFactory.implementations();
      expect(imp.length).to.be.gt(0);
      const clone = imp[imp.length - 1];
      expect(clone).to.be.properAddress;
      expect(clone).to.be.not.equal(openNFTs.address);
    });

    it("Should give 2 implementations", async function () {
      const imp = await cloneFactory.implementations();
      expect(imp.length).to.be.equal(2);
      expect(imp[1]).to.be.properAddress;
    });
  });

  describe("Add clone", function () {
    let implementation: Contract;

    beforeEach(async () => {
      const factoryCloneFactory = await ethers.getContractFactory("CloneFactory");
      cloneFactory = (await factoryCloneFactory.deploy()) as CloneFactory;

      const newOpenNFTs = await ethers.getContractFactory("OpenNFTs");
      implementation = await newOpenNFTs.deploy();
    });

    describe("With template", function () {
      beforeEach(async () => {
        await (await cloneFactory.addTemplate(openNFTs.address)).wait();
      });

      it("Should not fail", async function () {
        await expect(cloneFactory.addClone(implementation.address, 1, tester1Address)).to.not.be
          .reverted;
      });

      it("Should add existing clone", async function () {
        await (await cloneFactory.addClone(implementation.address, 1, tester1Address)).wait();

        const imp = await cloneFactory.implementations();
        expect(imp.length).to.be.equal(2);
        expect(imp[1]).to.be.properAddress;
      });

      it("Should fail with version 0", async function () {
        await expect(
          cloneFactory.addClone(implementation.address, 0, tester1Address)
        ).to.be.revertedWith("Wrong version");
      });

      it("Should fail with version 2", async function () {
        await expect(
          cloneFactory.addClone(implementation.address, 2, tester1Address)
        ).to.be.revertedWith("Wrong version");
      });
    });

    describe("Without template", function () {
      it("Should fail", async function () {
        await expect(
          cloneFactory.addClone(implementation.address, 1, tester1Address)
        ).to.be.revertedWith("No template yet");
      });
    });
  });

  describe("Mixed game", function () {
    it("Should work : 1 template 2 clones 1 template 1 clone 1 template 1 add clone", async function () {
      const newOpenNFTs = await ethers.getContractFactory("OpenNFTs");
      const implementation = await newOpenNFTs.deploy();

      expect(await cloneFactory.version()).to.be.equal(0);
      expect((await cloneFactory.implementations()).length).to.be.equal(0);

      // 1st template = version 1
      await (await cloneFactory.addTemplate(openNFTs.address)).wait();
      // 2 clones
      await (await cloneFactory.clone()).wait();
      await (await cloneFactory.clone()).wait();

      expect(await cloneFactory.version()).to.be.equal(1);
      expect((await cloneFactory.implementations()).length).to.be.equal(3);

      // 2nd template = version 2
      await (await cloneFactory.addTemplate(openNFTs.address)).wait();
      // 1 clone
      await (await cloneFactory.clone()).wait();

      expect(await cloneFactory.version()).to.be.equal(2);
      expect((await cloneFactory.implementations()).length).to.be.equal(5);

      // 3nd template = version 3
      await (await cloneFactory.addTemplate(openNFTs.address)).wait();
      // 1 add clone
      await (await cloneFactory.addClone(implementation.address, 1, tester1Address)).wait();

      const tmp = await cloneFactory.templates();
      expect(tmp.length).to.be.equal(3);
      expect(tmp[0]).to.be.equal(openNFTs.address);
      expect(tmp[1]).to.be.equal(openNFTs.address);
      expect(tmp[2]).to.be.equal(openNFTs.address);

      const imp = await cloneFactory.implementations();
      expect(imp.length).to.be.equal(7);
      expect(imp[0]).to.be.equal(openNFTs.address);
      expect(imp[1]).to.be.properAddress;
      expect(imp[2]).to.be.properAddress;
      expect(imp[3]).to.be.equal(openNFTs.address);
      expect(imp[4]).to.be.properAddress;
      expect(imp[5]).to.be.equal(openNFTs.address);
      expect(imp[6]).to.be.equal(implementation.address);
    });
  });
});
