import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { OpenNFTs } from "../types/OpenNFTs";

describe("Open NFTs contract", function () {
  let openNFTs: OpenNFTs;
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

  ethers;
  before(async () => {
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const signer = await ethers.getNamedSigner("deployer");

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;

    await (await openNFTs.mintNFT(artist, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(openNFTs.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should not initialize OpenNFTs name and NFT symbol after deploy", async function () {
    const name = "Open NFTs";
    const symbol = "NFT";

    expect(await openNFTs.symbol()).to.be.equal(symbol);
    expect(await openNFTs.name()).to.be.equal(name);

    void expect(openNFTs.initialize(name, symbol)).to.be.revertedWith("Initializable: contract is already initialized");
  });

  it("Should get openNFTs balanceOf", async function () {
    expect(await openNFTs.balanceOf(artist)).to.be.gte(1);
  });

  it("Should get openNFTs totalSupply", async function () {
    expect(await openNFTs.totalSupply()).to.be.gte(1);
  });

  it("Should check openNFTsV2 interface", async function () {
    expect(await openNFTs.supportsInterface("0xa6123562")).to.be.true;
  });
});
