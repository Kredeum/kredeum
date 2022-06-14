import { expect } from "chai";

import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { getChainId, network, ethers, deployments } from "hardhat";
import { BigNumber, Wallet } from "ethers";

import type { OpenBound } from "types/OpenBound";
import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IOpenBound from "abis/IOpenBound.json";

import { interfaceId } from "lib/kconfig";
import { cidToInt } from "lib/kcid";
import { fetchJson } from "lib/kfetch";

const { provider, getNamedSigner, getContract } = ethers;
const maxSupply = 42;
const blockDelta = "0x400";

let chainId: number;
let openBound: OpenBound;
let deployer: SignerWithAddress;
let tester1: SignerWithAddress;

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

describe("OpenBound", () => {
  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    deployer = await getNamedSigner("deployer");
    tester1 = await getNamedSigner("tester1");

    tokenId0 = ownerXorTokenID(deployer.address, uint0);
    tokenIdK = ownerXorTokenID(deployer.address, uintK);
  });

  describe("Unit tests", () => {
    let firstTokenID: BigNumber;

    beforeEach(async () => {
      await provider.send("hardhat_reset", []);

      if (chainId === 31337) await deployments.fixture(["OpenBound"]);
      await provider.send("hardhat_mine", [blockDelta]);

      openBound = (await getContract("OpenBound", deployer)) as unknown as OpenBound;
      if (chainId === 31337) {
        await openBound.mint(tokenId0);
        firstTokenID = await openBound.tokenByIndex(0);
      }
    });

    it("Should be deployed", () => {
      expect(deployer.address).to.be.properAddress;
      expect(tester1.address).to.be.properAddress;
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
      await expect(openBound.transferFrom(deployer.address, tester1.address, tokenID)).to.be.revertedWith(
        "Non transferable NFT"
      );
      await expect(
        openBound["safeTransferFrom(address,address,uint256)"](deployer.address, tester1.address, tokenID)
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
      await expect(openBound.connect(tester1).mint(3)).to.be.not.reverted;

      expect(await openBound.totalSupply()).to.be.equal(2);
    });

    it("Should revert", async () => {
      await expect(openBound.tokenURI(42)).to.be.revertedWith("NFT doesn't exists");
      await expect(openBound.tokenByIndex(42)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 42)).to.be.revertedWith("Invalid index");
    });
  });

  describe("AMA use case", () => {
    beforeEach(async () => {
      await provider.send("hardhat_reset", []);

      if (chainId === 31337) await deployments.fixture(["OpenBound"]);

      openBound = (await getContract("OpenBound", deployer)) as unknown as OpenBound;
    });
    describe("Should burn", () => {
      it("Should burn one in one", async () => {
        await provider.send("hardhat_mine", [blockDelta]);

        expect(await openBound.totalSupply()).to.be.equal(0);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
        await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
        await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

        await openBound.mint(tokenId0);

        expect(await openBound.totalSupply()).to.be.equal(1);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
        expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);
        expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenId0);

        await openBound.burn(tokenId0);

        expect(await openBound.totalSupply()).to.be.equal(0);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
        await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
        await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");
      });

      it("Should burn first in two", async () => {
        await provider.send("hardhat_mine", [blockDelta]);

        expect(await openBound.totalSupply()).to.be.equal(0);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
        await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
        await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

        await openBound.mint(tokenId0);
        await openBound.connect(tester1).mint(tokenIdK);

        expect(await openBound.totalSupply()).to.be.equal(2);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
        expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
        expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);
        expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIdK);
        expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenId0);
        expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIdK);

        await openBound.burn(tokenId0);

        expect(await openBound.totalSupply()).to.be.equal(1);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
        expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
        expect(await openBound.tokenByIndex(0)).to.be.equal(tokenIdK);
        await expect(openBound.tokenByIndex(1)).to.be.revertedWith("Invalid index");
        await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");
        expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIdK);
      });

      it("Should burn second in two", async () => {
        await provider.send("hardhat_mine", [blockDelta]);

        expect(await openBound.totalSupply()).to.be.equal(0);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
        await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
        await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

        await openBound.mint(tokenId0);
        await openBound.connect(tester1).mint(tokenIdK);

        expect(await openBound.totalSupply()).to.be.equal(2);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
        expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
        expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);
        expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIdK);
        expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenId0);
        expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIdK);

        await openBound.connect(tester1).burn(tokenIdK);

        expect(await openBound.totalSupply()).to.be.equal(1);
        expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
        expect(await openBound.balanceOf(tester1.address)).to.be.equal(0);
        expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);
        await expect(openBound.tokenByIndex(1)).to.be.revertedWith("Invalid index");
        expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenId0);
        await expect(openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.revertedWith("Invalid index");
      });

      it("Should burn second in two bis", async () => {
        await provider.send("hardhat_mine", [blockDelta]);

        await openBound.connect(deployer).mint(tokenId0);
        await openBound.connect(tester1).mint(tokenIdK);

        await openBound.connect(deployer).burn(tokenId0);
        await expect(openBound.connect(tester1).burn(tokenIdK)).to.be.not.reverted;
      });
    });

    it("Should Mint token after block", async () => {
      await expect(openBound.mint(0)).to.be.revertedWith("Not allowed yet");
      await provider.send("hardhat_mine", [blockDelta]);
      await expect(openBound.mint(0)).to.be.not.reverted;
    });

    it("Should Mint up to maxSupply", async () => {
      await provider.send("hardhat_mine", [blockDelta]);

      for (let i = 0; i < maxSupply; i++) {
        const signer = Wallet.createRandom().connect(provider);
        await provider.send("hardhat_setBalance", [signer.address, "0x1000000000000000"]);
        await expect(openBound.connect(signer).mint(i)).to.be.not.reverted;
      }

      expect(await openBound.totalSupply()).to.be.equal(maxSupply);
      await expect(openBound.mint(99)).to.be.revertedWith("Max supply reached");
    });

    it("Should get tokenID", async () => {
      await provider.send("hardhat_mine", [blockDelta]);
      await openBound.mint(tokenIdK);

      const tokenId = await openBound.tokenByIndex(0);
      const tokenIdOwner = await openBound.tokenOfOwnerByIndex(deployer.address, 0);
      expect(tokenId).to.be.equal(tokenIdOwner);

      expect(tokenId).to.be.equal(tokenIdK);

      const tokenURI = await openBound.tokenURI(tokenIdK);
      expect(tokenURI).to.be.equal(ipfsK);

      const json = (await fetchJson(tokenURI)) as { minter?: string; error?: string };
      console.log("minter", json?.minter || json?.error || "");
    });

    it("Should mint OK", async () => {
      await provider.send("hardhat_mine", [blockDelta]);

      await expect(openBound.mint(tokenId0)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenId0);

      await expect(openBound.connect(tester1).mint(tokenIdK)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIdK);
    });

    it("Should mint KO", async () => {
      await provider.send("hardhat_mine", [blockDelta]);

      await openBound.mint(uintK);
      await expect(openBound.mint(tokenIdK)).to.be.revertedWith("Already minted or claimed");
    });
  });
});
