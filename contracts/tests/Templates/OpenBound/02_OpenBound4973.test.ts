import { expect } from "chai";

import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import hre from "hardhat";

import type { NetworkType } from "@lib/common/ktypes";
import type { OpenBound4973 } from "@soltypes/contracts/dev";
import { networks } from "@lib/common/kconfig";

const ipfs0 = "ipfs://bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

let chainId: number;
let network: NetworkType | undefined;
let openBound: OpenBound4973;
let deployer: SignerWithAddress;
let tester: SignerWithAddress;

describe("00 Setup TS", () => {
  before(async () => {
    chainId = Number(await hre.getChainId());
    console.log("network", chainId, hre.network.name, hre.network.live);

    network = networks.find((nw) => nw.chainId === chainId);

    deployer = await hre.ethers.getNamedSigner("deployer");
    tester = await hre.ethers.getNamedSigner("tester1");
    if (chainId === 31337) {
      await hre.deployments.fixture(["OpenBound4973"]);
    }

    openBound = (await hre.ethers.getContract("OpenBound4973", deployer)) as unknown as OpenBound4973;
    await openBound["mint(uint256)"](0);
  });

  it("Should be deployed", () => {
    expect(network?.chainId).to.be.equal(chainId);
    expect(deployer.address).to.be.properAddress;
    expect(tester.address).to.be.properAddress;
    expect(openBound.address).to.be.properAddress;
  });

  it("Should be IERC721Metadata", async () => {
    expect(await openBound.name()).to.be.equal("OpenBound4973");
    expect(await openBound.symbol()).to.be.equal("B4973");
    expect(await openBound.tokenURI(0)).to.be.equal(ipfs0);
  });

  it("Should be IERC721Enumerable", async () => {
    expect(await openBound.totalSupply()).to.be.equal(1);
    expect(await openBound.tokenByIndex(0)).to.be.equal(0);
    expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(0);
  });

  it("Should be IERC173", async () => {
    expect(await openBound.owner()).to.be.equal(deployer.address);
    await expect(openBound.transferOwnership(tester.address))
      .to.emit(openBound, "OwnershipTransferred")
      .withArgs(deployer.address, tester.address);
    expect(await openBound.owner()).to.be.equal(tester.address);
    await expect(openBound.transferOwnership(deployer.address)).to.be.not.reverted;
  });

  it("Should be IERC4973", async () => {
    expect(await openBound.ownerOf(0)).to.be.equal(deployer.address);
    await expect(openBound["mint(uint256)"](1)).to.emit(openBound, "Attest").withArgs(deployer.address, 1);
    await expect(openBound["mint(address,uint256)"](tester.address, 2))
      .to.emit(openBound, "Attest")
      .withArgs(tester.address, 2);
  });

  it("Should be IOpenBound", async () => {
    await expect(openBound["mint(uint256)"](3)).to.be.not.reverted;
    await expect(openBound["mint(address,uint256)"](tester.address, 4)).to.be.not.reverted;
  });

  it("Should revert", async () => {
    await expect(openBound["mint(uint256)"](0)).to.be.revertedWith("NFT already exists");
    await expect(openBound["mint(address,uint256)"](tester.address, 0)).to.be.revertedWith("NFT already exists");

    await expect(openBound.tokenURI(42)).to.be.revertedWith("NFT doesn't exists");
    await expect(openBound.tokenByIndex(42)).to.be.revertedWith("Invalid index");
    await expect(openBound.tokenOfOwnerByIndex(deployer.address, 42)).to.be.revertedWith("Invalid index");
  });
});
