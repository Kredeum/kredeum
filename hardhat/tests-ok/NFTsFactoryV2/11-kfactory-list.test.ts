import type { NFTsFactoryV2, OpenNFTsV3 } from "@soltypes/contracts";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { constants, Signer } from "ethers";

describe("11 NFTs Factory contract", function () {
  let nftsFactoryV2: NFTsFactoryV2;
  let openNFTsV3: OpenNFTsV3;
  let owner: string;
  let signer: Signer;
  const txOptions = {
    value: constants.Zero,
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    owner = await signer.getAddress();
    const { deployer } = await ethers.getNamedSigners();

    if ((await ethers.provider.getNetwork()).chainId === 31337) {
      await deployments.fixture(["OpenNFTsV3", "NFTsFactoryV2"]);
    }
    openNFTsV3 = (await ethers.getContract("OpenNFTsV3", signer)) as unknown as OpenNFTsV3;
    expect(openNFTsV3.address).to.be.properAddress;

    nftsFactoryV2 = (await ethers.getContract("NFTsFactoryV2", signer)) as unknown as NFTsFactoryV2;
    expect(nftsFactoryV2.address).to.be.properAddress;

    await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);

    await (await openNFTsV3.mintOpenNFT(owner, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(nftsFactoryV2.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should get nftsFactoryV2 balancesOf", async function () {
    // console.log(await nftsFactoryV2.populateTransaction.balancesOf(owner));
    // console.log(`nftsFactoryV2.balancesOf ${owner} ${await nftsFactoryV2.balancesOf(owner)}`);
    void expect(await nftsFactoryV2.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactoryV2 abis", function () {
    // console.log(nftsFactoryV2.interface.format("minimal"));
    expect(nftsFactoryV2.interface.format("minimal").length).to.be.gt(1);
  });
});
