import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { BigNumber, Signer } from "ethers";
import type { SignerWithAddress } from "hardhat-deploy-ethers/src/signers";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

describe("11 NFTs Factory contract", function () {
  let nftsFactory: NFTsFactoryV2;
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

    nftsFactory = await ethers.getContract("NFTsFactoryV2", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await nftsFactory.connect(deployer).templateSet(openNFTsV3.address, "generic");

    await (await openNFTsV3.mintNFT(owner, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should clone", async function () {
    let nClone = await nftsFactory.implementationsCount();
    expect(nClone).to.be.equal(0);

    await (await nftsFactory.connect(signer).clone("Open NFTs", "NFT", "generic", txOptions)).wait();

    nClone = await nftsFactory.implementationsCount();
    expect(nClone).to.be.equal(1);

    const clone = await nftsFactory.implementations(nClone.sub(1));
    expect(clone).to.be.properAddress;
    expect(clone).to.be.not.equal(openNFTsV3.address);
  });

  it("Should get nftsFactory balancesOf", async function () {
    console.log(await nftsFactory.populateTransaction.balancesOf(owner));
    // console.log(`nftsFactory.balancesOf ${owner} ${await nftsFactory.balancesOf(owner)}`);
    void expect(await nftsFactory.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactory abis", function () {
    // console.log(nftsFactory.interface.format("minimal"));
    expect(nftsFactory.interface.format("minimal").length).to.be.gt(1);
  });
});
