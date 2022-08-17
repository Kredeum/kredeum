import type { NFTsFactoryV3, OpenNFTsV4 } from "soltypes/contracts/next";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { BigNumber, Signer } from "ethers";

describe.skip("11 NFTs Factory contract", function () {
  let nftsFactoryV3: NFTsFactoryV3;
  let openNFTsV4: OpenNFTsV4;
  let owner: string;
  let signer: Signer;
  const txOptions = {
    value: BigNumber.from(0),
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    owner = await signer.getAddress();
    const { deployer } = await ethers.getNamedSigners();

    if ((await ethers.provider.getNetwork()).chainId === 31337) {
      await deployments.fixture(["OpenNFTsV4", "NFTsFactoryV3"]);
    }
    openNFTsV4 = (await ethers.getContract("OpenNFTsV4", signer)) as unknown as OpenNFTsV4;
    expect(openNFTsV4.address).to.be.properAddress;

    nftsFactoryV3 = (await ethers.getContract("NFTsFactoryV3", signer)) as unknown as NFTsFactoryV3;
    expect(nftsFactoryV3.address).to.be.properAddress;

    await nftsFactoryV3.connect(deployer).setTemplate("generic", openNFTsV4.address);

    // TODO await (await openNFTsV4.mint(owner, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(nftsFactoryV3.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should get nftsFactoryV3 balancesOf", async function () {
    // console.log(await nftsFactoryV3.populateTransaction.balancesOf(owner));
    // console.log(`nftsFactoryV3.balancesOf ${owner} ${await nftsFactoryV3.balancesOf(owner)}`);
    // TODO void expect(await nftsFactoryV3.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactoryV3 abis", function () {
    // console.log(nftsFactoryV3.interface.format("minimal"));
    expect(nftsFactoryV3.interface.format("minimal").length).to.be.gt(1);
  });
});
