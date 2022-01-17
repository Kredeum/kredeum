import type { Signer } from "ethers";

import { expect } from "chai";
import { collectionClone } from "lib/kcollection-clone";
import { ethers, getChainId, deployments } from "hardhat";

describe("Clone collection", function () {
  let signer: Signer;
  let chainId: number;

  before(async () => {
    signer = await ethers.getNamedSigner("deployer");
    chainId = Number(await getChainId());

    if ((await ethers.provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone collection", async function () {
    expect(await collectionClone(chainId, "Test", signer)).to.be.properAddress;
  });
});
