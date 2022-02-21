import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { BigNumber, Signer } from "ethers";
import type { SignerWithAddress } from "hardhat-deploy-ethers/src/signers";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

describe("11 NFTs Factory contract", function () {
  let nftsFactoryV2: NFTsFactoryV2;
  let openNFTsV3: OpenNFTsV3;
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
      await deployments.fixture(["OpenNFTsV3", "NFTsFactoryV2"]);
    }
    openNFTsV3 = await ethers.getContract("OpenNFTsV3", signer);
    expect(openNFTsV3.address).to.be.properAddress;

    nftsFactoryV2 = await ethers.getContract("NFTsFactoryV2", signer);
    expect(nftsFactoryV2.address).to.be.properAddress;

    await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV3.address);

    await (await openNFTsV3.mintNFT(owner, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(nftsFactoryV2.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should get template", async function () {
    expect(await nftsFactoryV2.templates("generic")).to.be.equal(openNFTsV3.address);
  });

  it("Should get version 2", async function () {
    expect(await nftsFactoryV2.version()).to.be.equal(2);
  });

  it("Should clone", async function () {
    let nClone = await nftsFactoryV2.implementationsCount();
    expect(nClone).to.be.equal(0);

    await (await nftsFactoryV2.connect(signer).clone("Open NFTs", "NFT", "generic", txOptions)).wait();

    nClone = await nftsFactoryV2.implementationsCount();
    expect(nClone).to.be.equal(1);

    const clone = await nftsFactoryV2.implementations(nClone.sub(1));
    expect(clone).to.be.properAddress;
    expect(clone).to.be.not.equal(openNFTsV3.address);
  });

  it("Should get nftsFactoryV2 balancesOf", async function () {
    console.log(await nftsFactoryV2.populateTransaction.balancesOf(owner));
    // console.log(`nftsFactoryV2.balancesOf ${owner} ${await nftsFactoryV2.balancesOf(owner)}`);
    void expect(await nftsFactoryV2.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactoryV2 abis", function () {
    // console.log(nftsFactoryV2.interface.format("minimal"));
    expect(nftsFactoryV2.interface.format("minimal").length).to.be.gt(1);
  });
});
