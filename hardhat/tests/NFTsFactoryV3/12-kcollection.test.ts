import type { JsonRpcSigner } from "@ethersproject/providers";

import { expect } from "chai";
import { collectionClone } from "lib/kcollection-clone";
import { ethers, getChainId, deployments } from "hardhat";
import type { NFTsFactoryV3, OpenNFTsV4 } from "soltypes/contracts/next";

const { provider, getContract, getNamedSigners } = ethers;

describe.skip("12 Clone collection", function () {
  let jsonRpcSigner: JsonRpcSigner;
  let chainId: number;
  let nftsFactoryV3: NFTsFactoryV3;

  before(async () => {
    chainId = Number(await getChainId());

    const { deployer } = await getNamedSigners();
    jsonRpcSigner = provider.getSigner(deployer.address);

    if ((await provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["OpenNFTsV4", "NFTsFactoryV3"]);
    }
    nftsFactoryV3 = (await getContract("NFTsFactoryV3", deployer)) as unknown as NFTsFactoryV3;
    const openNFTsV4 = (await getContract("OpenNFTsV4")) as unknown as OpenNFTsV4;
    await nftsFactoryV3.setTemplate("OpenNFTsV4", openNFTsV4.address);
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone by contract", async function () {
    await expect(nftsFactoryV3.clone("NFT collection", "COLL", "OpenNFTsV4", [true, false])).to.be.not.reverted;
  });

  it("Should clone by lib Ownable collection", async function () {
    expect(await collectionClone(chainId, "Test Collection", "OWN", "OpenNFTsV4/ownable", jsonRpcSigner)).to.be
      .properAddress;
  });

  it("Should clone by lib Generic collection", async function () {
    expect(await collectionClone(chainId, "Generic Collection", "GEN", "OpenNFTsV4/generic", jsonRpcSigner)).to.be
      .properAddress;
  });
});
