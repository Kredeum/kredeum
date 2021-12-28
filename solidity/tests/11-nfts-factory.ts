import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { BigNumber } from "ethers";
import type { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
import type { NFTsFactory } from "../types/NFTsFactory";
import type { OpenNFTs } from "../types/OpenNFTs";

describe("NFTs Factory contract", function () {
  let nftsFactory: NFTsFactory;
  let openNFTs: OpenNFTs;
  let owner: string;
  let signer: SignerWithAddress;
  const txOptions = {
    value: BigNumber.from(0),
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };

  before(async () => {
    signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    if ((await ethers.provider.getNetwork()).chainId === 31337) {
      await deployments.fixture(["OpenNFTs", "NFTsFactory"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;

    nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await (await openNFTs.mintNFT(owner, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(nftsFactory.interface.getSighash("balanceOf")).to.be.equal("0xf7888aec");
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should clone", async function () {
    await (await nftsFactory.connect(signer).clone("Open NFTs", "NFT", txOptions)).wait();
    const nClone = await nftsFactory.implementationsCount();
    expect(nClone).to.be.gte(2);
    const clone = await nftsFactory.implementations(nClone.sub(1));
    expect(clone).to.be.properAddress;
    expect(clone).to.be.not.equal(openNFTs.address);
  });

  it("Should get nftsFactory balanceOf", async function () {
    const bal = await nftsFactory.balanceOf(openNFTs.address, owner);
    console.log(`nftsFactory.balanceOf ${owner}`, bal);
    expect(bal.balanceOf).to.be.gte(1);
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
