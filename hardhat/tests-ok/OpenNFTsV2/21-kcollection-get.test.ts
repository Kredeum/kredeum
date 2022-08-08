import type { OpenNFTsV2 } from "soltypes/contracts";

import abiIOpenNFTsOld from "abis/contracts/interfaces/IOpenNFTs.old.sol/IOpenNFTs.json";
import abiIOpenNFTsV2 from "abis/contracts/interfaces/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiIOpenNFTsV3 from "abis/contracts/interfaces/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import abiIERC173 from "abis/contracts/interfaces/IERC173.sol/IERC173.json";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { interfaceId } from "lib/kconfig";

describe("21 OpenNFTsV2 contract", function () {
  let openNFTsV2: OpenNFTsV2;
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
      await deployments.fixture(["OpenNFTsV2"]);
    }
    openNFTsV2 = (await ethers.getContract("OpenNFTsV2", signer)) as unknown as OpenNFTsV2;
    expect(openNFTsV2.address).to.be.properAddress;

    await (await openNFTsV2.mintNFT(artist, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(openNFTsV2.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should not initialize OpenNFTsV2 name and NFT symbol after deploy", async function () {
    const name = "Open NFTs";
    const symbol = "NFT";

    expect(await openNFTsV2.symbol()).to.be.equal(symbol);
    expect(await openNFTsV2.name()).to.be.equal(name);

    void expect(openNFTsV2.initialize(name, symbol)).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("Should get openNFTsV2 balanceOf", async function () {
    expect(await openNFTsV2.balanceOf(artist)).to.be.gte(1);
  });

  it("Should get openNFTsV2 totalSupply", async function () {
    expect(await openNFTsV2.totalSupply()).to.be.gte(1);
  });

  it("Should check openNFTsV2 interface", async function () {
    expect(await openNFTsV2.supportsInterface(interfaceId(abiIOpenNFTsV2))).to.be.true;
    expect(await openNFTsV2.supportsInterface(interfaceId(abiIOpenNFTsOld))).to.be.false;
    expect(await openNFTsV2.supportsInterface(interfaceId(abiIOpenNFTsV3))).to.be.false;
    expect(await openNFTsV2.supportsInterface(interfaceId(abiIERC173))).to.be.false;
  });
});
