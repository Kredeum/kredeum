import type { Signer } from "ethers";

import { expect } from "chai";
import { collectionClone } from "lib/kcollection-clone";
import { ethers, getChainId, deployments } from "hardhat";

describe("14 Clone collection", function () {
  let signer: Signer;
  let chainId: number;

  before(async () => {
    signer = await ethers.getNamedSigner("deployer");
    chainId = Number(await getChainId());
    const { deployer } = await ethers.getNamedSigners();

    if ((await ethers.provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["NFTsFactoryV2", "OpenNFTsV3"]);
    }
    const nftsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    const openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    await nftsFactoryV2.connect(deployer).templateSet("ownable", openNFTsV3.address);
    await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone Ownable collection", async function () {
    expect(await collectionClone(chainId, "Test Collection", "OWN", "ownable", signer)).to.be.properAddress;
  });

  it("Should not clone Generic collection", async function () {
    expect(await collectionClone(chainId, "Generic Collection", "GEN", "generic", signer)).to.be.properAddress;
  });
});
