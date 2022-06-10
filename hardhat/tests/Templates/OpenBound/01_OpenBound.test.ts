import { expect } from "chai";

import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { getChainId, network, ethers, deployments } from "hardhat";
import { BigNumber } from "ethers";

import type { OpenBound } from "types/OpenBound";
import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IOpenBound from "abis/IOpenBound.json";

import { interfaceId } from "lib/kconfig";
import { cidToInt } from "lib/kcid";
import { fetchJson } from "lib/kfetch";

const maxSupply = 42;
const blockDelta = "0x64";

let chainId: number;
let openBound: OpenBound;
let deployer: SignerWithAddress;
let tester: SignerWithAddress;

const cid0 = "bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const cidK = "bafkreigtkp7klpfeklq3cegtls3nferkoztqghmgpbhwntgcdr2z6v6thi";
const ipfs0 = `ipfs://${cid0}`;
const ipfsK = `ipfs://${cidK}`;
const uint0 = "0";
const uintK = cidToInt(cidK);
let tokenId0: string;
let tokenIdK: string;

const ownerXorTokenID = (owner: string, tokenID: string): string => {
  return String(BigNumber.from(owner).xor(BigNumber.from(tokenID)));
};

describe.only("OpenBound", () => {
  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    deployer = await ethers.getNamedSigner("deployer");
    tester = await ethers.getNamedSigner("tester1");

    tokenId0 = ownerXorTokenID(deployer.address, uint0);
    tokenIdK = ownerXorTokenID(deployer.address, uintK);
  });

  describe("Unit tests", () => {
    let firstTokenID: BigNumber;

    beforeEach(async () => {
      await ethers.provider.send("hardhat_reset", []);

      if (chainId === 31337) await deployments.fixture(["OpenBound"]);
      await ethers.provider.send("hardhat_mine", ["0x100"]);

      openBound = (await ethers.getContract("OpenBound", deployer)) as unknown as OpenBound;
      if (chainId === 31337) {
        await openBound.mint(uint0);
        firstTokenID = await openBound.tokenByIndex(0);
      }
    });

    it("Should be deployed", () => {
      expect(deployer.address).to.be.properAddress;
      expect(tester.address).to.be.properAddress;
      expect(openBound.address).to.be.properAddress;
    });

    it("Should support interfaces ", async function () {
      expect(await openBound.supportsInterface(interfaceId(IERC165))).to.be.true;
      expect(await openBound.supportsInterface(interfaceId(IERC721))).to.be.true;
      expect(await openBound.supportsInterface(interfaceId(IERC721Enumerable))).to.be.true;
      expect(await openBound.supportsInterface(interfaceId(IERC721Metadata))).to.be.true;
      expect(await openBound.supportsInterface(interfaceId(IOpenBound))).to.be.true;
    });

    it("Should be IERC721", async () => {
      const tokenID = await openBound.tokenByIndex(0);
      expect(await openBound.ownerOf(tokenID)).to.be.equal(deployer.address);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
    });

    it("Should be not transferable", async () => {
      const tokenID = await openBound.tokenByIndex(0);
      await expect(openBound.transferFrom(deployer.address, tester.address, tokenID)).to.be.revertedWith(
        "Non transferable NFT"
      );
      await expect(
        openBound["safeTransferFrom(address,address,uint256)"](deployer.address, tester.address, tokenID)
      ).to.be.revertedWith("Non transferable NFT");
    });

    it("Should be IERC721Metadata", async () => {
      expect(await openBound.name()).to.be.equal("OpenBound");
      expect(await openBound.symbol()).to.be.equal("BOUND");
      expect(await openBound.tokenURI(firstTokenID)).to.be.equal(ipfs0);
    });

    it("Should be IERC721Enumerable", async () => {
      expect(await openBound.totalSupply()).to.be.equal(1);
      expect(await openBound.tokenByIndex(0)).to.be.equal(firstTokenID);
      expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(firstTokenID);
    });

    it("Should be IOpenBound", async () => {
      await expect(openBound.mint(3)).to.be.not.reverted;
      expect(await openBound.totalSupply()).to.be.equal(2);
    });

    it("Should revert", async () => {
      await expect(openBound.mint(uint0)).to.be.revertedWith("ERC721: token already minted");
      await expect(openBound.tokenURI(42)).to.be.revertedWith("NFT doesn't exists");
      await expect(openBound.tokenByIndex(42)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 42)).to.be.revertedWith("Invalid index");
    });
  });

  describe("AMA use case", () => {
    beforeEach(async () => {
      await ethers.provider.send("hardhat_reset", []);

      if (chainId === 31337) await deployments.fixture(["OpenBound"]);

      openBound = (await ethers.getContract("OpenBound", deployer)) as unknown as OpenBound;
    });

    it("Should Mint token after block", async () => {
      await expect(openBound.mint(0)).to.be.revertedWith("Not allowed yet");
      await ethers.provider.send("hardhat_mine", [blockDelta]);
      await expect(openBound.mint(0)).to.be.not.reverted;
    });

    it("Should Mint up to maxSupply", async () => {
      await ethers.provider.send("hardhat_mine", [blockDelta]);
      for (let i = 0; i < maxSupply; i++) {
        await expect(openBound.mint(i)).to.be.not.reverted;
      }
      await expect(openBound.mint(99)).to.be.revertedWith("Max supply reached");
      expect(await openBound.totalSupply()).to.be.equal(maxSupply);
    });

    it("Should get tokenID", async () => {
      await ethers.provider.send("hardhat_mine", [blockDelta]);
      await openBound.mint(uintK);

      const tokenId = await openBound.tokenByIndex(0);
      const tokenIdOwner = await openBound.tokenOfOwnerByIndex(deployer.address, 0);
      expect(tokenId).to.be.equal(tokenIdOwner);

      expect(tokenId).to.be.equal(tokenIdK);

      const tokenURI = await openBound.tokenURI(tokenIdK);
      expect(tokenURI).to.be.equal(ipfsK);

      const json = (await fetchJson(tokenURI)) as { minter?: string; error?: string };
      console.log("minter", json?.minter || json?.error || "");
    });

    it("Should claim OK", async () => {
      await ethers.provider.send("hardhat_mine", [blockDelta]);

      await expect(openBound.claim(tokenId0)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);

      await expect(openBound.claim(tokenIdK)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIdK);
    });

    it("Should claim KO", async () => {
      await ethers.provider.send("hardhat_mine", [blockDelta]);

      await openBound.mint(uintK);
      await expect(openBound.claim(tokenIdK)).to.be.revertedWith("ERC721: token already minted");
    });
  });
});
