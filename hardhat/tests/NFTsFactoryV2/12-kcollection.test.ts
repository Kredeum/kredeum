import type { Signer } from "ethers";
import type { JsonRpcSigner } from "@ethersproject/providers";

import { expect } from "chai";
import { collectionClone } from "lib/kcollection-clone";
import { ethers, getChainId, deployments } from "hardhat";
import type { NFTsFactoryV2 } from "types/NftsFactoryV2";

describe("12 Clone collection", function () {
  let jsonRpcSigner: JsonRpcSigner;
  let chainId: number;

  before(async () => {
    chainId = Number(await getChainId());

    const { deployer } = await ethers.getNamedSigners();
    jsonRpcSigner = ethers.provider.getSigner(deployer.address);

    if ((await ethers.provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["NFTsFactoryV2", "OpenNFTsV3"]);
    }
    const nftsFactoryV2: NFTsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    const openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    await nftsFactoryV2.connect(deployer).templateSet("ownable", openNFTsV3.address);
    await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone Ownable collection", async function () {
    expect(await collectionClone(chainId, "Test Collection", "OWN", "ownable", jsonRpcSigner)).to.be.properAddress;
  });

  it("Should not clone Generic collection", async function () {
    expect(await collectionClone(chainId, "Generic Collection", "GEN", "generic", jsonRpcSigner)).to.be.properAddress;
  });
});
