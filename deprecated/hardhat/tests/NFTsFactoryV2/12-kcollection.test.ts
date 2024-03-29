import type { JsonRpcSigner } from "@ethersproject/providers";

import { expect } from "chai";
import { collectionClone } from "@lib/collection/kcollection-clone";
import { ethers, getChainId, deployments } from "hardhat";
import type { NFTsFactoryV2, OpenNFTsV3 } from "@soltypes/contracts";
const { provider, getContract, getNamedSigners } = ethers;

describe("12 Clone collection", function () {
  let jsonRpcSigner: JsonRpcSigner;
  let chainId: number;
  let nftsFactoryV2: NFTsFactoryV2;

  before(async () => {
    chainId = Number(await getChainId());

    const { deployer } = await getNamedSigners();
    jsonRpcSigner = provider.getSigner(deployer.address);

    if ((await provider.getNetwork()).chainId == 31337) {
      await deployments.fixture(["OpenNFTsV3", "NFTsFactoryV2"]);
    }
    nftsFactoryV2 = (await getContract("NFTsFactoryV2", deployer)) as unknown as NFTsFactoryV2;
    const openNFTsV3 = (await getContract("OpenNFTsV3")) as unknown as OpenNFTsV3;
    await nftsFactoryV2.templateSet("OpenNFTsV3", openNFTsV3.address);
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone by contract", async function () {
    await expect(nftsFactoryV2.clone("NFT collection", "COLL", "OpenNFTsV4", [true, false])).to.be.not.reverted;
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
