import type { OpenNFTsV4 } from "soltypes/contracts/templates";

import abiIERC173 from "abis/contracts/interfaces/IERC173.sol/IERC173.json";
import abiIOpenNFTsV2 from "abis/contracts/interfaces/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiIOpenNFTsV4 from "abis/contracts/interfaces/IOpenNFTsV4.sol/IOpenNFTsV4.json";

import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { interfaceId } from "lib/kconfig";

describe("41 OpenNFTsV4 contract", function () {
  let openNFTsV4: OpenNFTsV4;
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
      await deployments.fixture(["OpenNFTsV4"]);
    }
    openNFTsV4 = (await ethers.getContract("OpenNFTsV4", signer)) as unknown as OpenNFTsV4;
    expect(openNFTsV4.address).to.be.properAddress;

    await (await openNFTsV4["mint(address,string)"](artist, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(openNFTsV4.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should not initialize OpenNFTsV4 name and NFT symbol after deploy", async function () {
    void expect(openNFTsV4.initialize("Open NFTs", "NFT", artist, [true, false])).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("Should get openNFTsV4 balanceOf", async function () {
    expect(await openNFTsV4.balanceOf(artist)).to.be.gte(1);
  });

  it("Should get openNFTsV4 totalSupply", async function () {
    expect(await openNFTsV4.totalSupply()).to.be.gte(1);
  });

  it("Should check openNFTsV4 interface", async function () {
    expect(await openNFTsV4.supportsInterface(interfaceId(abiIOpenNFTsV4))).to.be.true;
    expect(await openNFTsV4.supportsInterface(interfaceId(abiIOpenNFTsV2))).to.be.false;
    expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC173))).to.be.true;
  });
});
