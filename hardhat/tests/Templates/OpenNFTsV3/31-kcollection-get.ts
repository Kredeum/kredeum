import type { OpenNFTsV3 } from "types/OpenNFTsV3";

import IOpenNFTsV3 from "abis/new/IOpenNFTsV3.json";
import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { interfaceId } from "lib/kconfig";

describe("31 OpenNFTsV3 contract", function () {
  let openNFTsV3: OpenNFTsV3;
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
      await deployments.fixture(["OpenNFTsV3"]);
    }
    openNFTsV3 = await ethers.getContract("OpenNFTsV3", signer);
    expect(openNFTsV3.address).to.be.properAddress;

    await (await openNFTsV3.mintNFT(artist, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(openNFTsV3.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should not initialize OpenNFTsV3 name and NFT symbol after deploy", async function () {
    const name = "Open NFTs";
    const symbol = "NFT";

    expect(await openNFTsV3.symbol()).to.be.equal(symbol);
    expect(await openNFTsV3.name()).to.be.equal(name);

    void expect(openNFTsV3.initialize(name, symbol, artist, true)).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("Should get openNFTsV3 balanceOf", async function () {
    expect(await openNFTsV3.balanceOf(artist)).to.be.gte(1);
  });

  it("Should get openNFTsV3 totalSupply", async function () {
    expect(await openNFTsV3.totalSupply()).to.be.gte(1);
  });

  it("Should check openNFTsV3 interface", async function () {
    expect(await openNFTsV3.supportsInterface(interfaceId(IOpenNFTsV3))).to.be.true;
  });
});
