import type { Signer } from "ethers";
import type { OpenNFTsV2 } from "@soltypes/contracts";
import type { OpenFactoryV3, OpenNFTsV4 } from "@soltypes/contracts/next";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe.skip("10 Clone Factory contract", function () {
  let nftsFactoryV3: OpenFactoryV3;
  let openNFTsV2: OpenNFTsV2;
  let openNFTsV4: OpenNFTsV4;
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
      await deployments.fixture(["OpenFactoryV3", "OpenNFTsV1", "OpenNFTsV2", "OpenNFTsV4"]);
    }
    nftsFactoryV3 = (await ethers.getContract("OpenFactoryV3")) as unknown as OpenFactoryV3;
    openNFTsV2 = (await ethers.getContract("OpenNFTsV2")) as unknown as OpenNFTsV2;
    openNFTsV4 = (await ethers.getContract("OpenNFTsV4")) as unknown as OpenNFTsV4;
  });

  describe("Should Setup", function () {
    it("Should deploy", function () {
      expect(nftsFactoryV3.address).to.be.properAddress;
    });

    it("Should get deployer as owner", async function () {
      expect(await nftsFactoryV3.owner()).to.be.equal(deployerAddress);
    });

    it("Should transfer ownership", async function () {
      await nftsFactoryV3.transferOwnership(tester1Address);
      expect(await nftsFactoryV3.owner()).to.be.equal(tester1Address);
    });

    it.skip("Should renounce ownership", async function () {
      //  TODO  await nftsFactoryV3.renounceOwnership();
      // expect(await nftsFactoryV3.owner()).to.be.equal(zeroAddress);
    });
  });

  describe.skip("Should Add Implementations", function () {
    // TODO   it("Should Add Implementation", async function () {
    //   const impCount = await nftsFactoryV3.implementationsCount();
    //   await expect(nftsFactoryV3.connect(deployer).implementationsAdd([openNFTsV2.address]))
    //     .to.emit(nftsFactoryV3, "ImplementationNew")
    //     .withArgs(openNFTsV2.address, deployerAddress, 1);
    //   expect(await nftsFactoryV3.implementationsCount()).to.be.equal(impCount.add(1));
    // });
    // it("Should not Add Implementation if Not Owner", async function () {
    //   await expect(nftsFactoryV3.connect(tester1).implementationsAdd([openNFTsV4.address])).to.be.revertedWith(
    //     "Ownable: caller is not the owner"
    //   );
    //   expect(await nftsFactoryV3.implementationsCount()).to.be.equal(1);
    // });
    // it("Should not Add Implementation if Not ERC721", async function () {
    //   await expect(nftsFactoryV3.connect(deployer).implementationsAdd([nftsFactoryV3.address])).to.be.revertedWith(
    //     "Not ERC721"
    //   );
    //   expect(await nftsFactoryV3.implementationsCount()).to.be.equal(1);
    // });
  });

  describe("Should Set Template", function () {
    it("Should Set Template", async function () {
      await expect(nftsFactoryV3.connect(deployer).setTemplate("generic", openNFTsV4.address))
        .to.emit(nftsFactoryV3, "TemplateSet")
        .withArgs("generic", openNFTsV4.address);

      expect(await nftsFactoryV3.templates("generic")).to.be.equal(openNFTsV4.address);
    });

    it("Should Not Set Template if Not Owner", async function () {
      await expect(nftsFactoryV3.connect(tester1).setTemplate("generic", openNFTsV4.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );

      expect(await nftsFactoryV3.templates("generic")).to.be.equal(zeroAddress);
    });

    it("Should not Set old Template", async function () {
      await expect(nftsFactoryV3.connect(deployer).setTemplate("older", openNFTsV2.address)).to.be.revertedWith(
        "Not valid OpenNFTs Template"
      );
      expect(await nftsFactoryV3.templates("generic")).to.be.equal(zeroAddress);
    });
  });

  describe("Should Clone", function () {
    it("Should Clone", async function () {
      await nftsFactoryV3.connect(deployer).setTemplate("generic", openNFTsV4.address);
      await expect(nftsFactoryV3.connect(deployer).clone("NFT collection", "COLL", "generic", [true, false])).to.emit(
        nftsFactoryV3,
        "ImplementationNew"
      );

      // TODO expect(await nftsFactoryV3.implementationsCount()).to.be.equal(2);
    });

    it("Should Not Clone inexistant Template Name", async function () {
      await expect(
        nftsFactoryV3.connect(deployer).clone("NFT collection", "COLL", "random", [true, false])
      ).to.be.revertedWith("Bad Template");
    });
  });
});
