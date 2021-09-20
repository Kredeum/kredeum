import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
import type { NFTsFactory } from "../artifacts/types/NFTsFactory";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

describe("NFTs Factory", function () {
  let nftsFactory: NFTsFactory;
  let openNFTs: OpenNFTs;
  let owner: string;
  let signer: SignerWithAddress;
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };

  before(async () => {
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    if (chainId === 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }
    nftsFactory = await ethers.getContract("NFTsFactory", signer);

    await (await nftsFactory.addTemplate(openNFTs.address, txOptions)).wait();
    await (await openNFTs.mintNFT("", txOptions)).wait();
  });

  it("Should get sighash", async function () {
    expect(nftsFactory.interface.getSighash("balanceOf")).to.be.equal("0xf7888aec");
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
    expect(openNFTs.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should get OpenNFTs name and NFT symbol", async function () {
    expect(await openNFTs.symbol()).to.be.equal("NFT");
    expect(await openNFTs.name()).to.be.equal("Open NFTs");
  });

  it("Should get openNFTs balanceOf", async function () {
    expect(await openNFTs.balanceOf(owner)).to.be.equal(1);
  });

  it("Should get nftsFactory balanceOf", async function () {
    console.log("BEFORE", openNFTs.address, owner);
    const bal = await nftsFactory.balanceOf(openNFTs.address, owner);
    console.log("AFTER");
    console.log("2", bal);
    expect(bal.balance).to.be.gte(1);
  });

  it("Should get nftsFactory balancesOf", async function () {
    console.log(await nftsFactory.populateTransaction.balancesOf(owner));
    console.log(`nftsFactory.balancesOf ${owner} ${await nftsFactory.balancesOf(owner)}`);
    expect(await nftsFactory.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactory abis", async function () {
    // console.log(nftsFactory.interface.format("minimal"));
    expect(nftsFactory.interface.format("minimal").length).to.be.gt(1);
  });
});
