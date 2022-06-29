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

const { provider, getNamedSigner, getContract } = ethers;

let chainId: number;
let openBound: OpenBound;
let deployer: SignerWithAddress;
let tester1: SignerWithAddress;

const cid0 = "bafkreihvvjmlzjiygo2wen3o6vwsaw7x3blghbltbon6ahldwee35t3ava";
const cidK = "bafkreigtkp7klpfeklq3cegtls3nferkoztqghmgpbhwntgcdr2z6v6thi";
const ipfs0 = `ipfs://${cid0}`;
const ipfsK = `ipfs://${cidK}`;
const cidUint0: string = cidToInt(cid0);
const cidUintK: string = cidToInt(cidK);
let tokenID0deployer: string;
let tokenID0tester1: string;
let tokenIDKdeployer: string;
let tokenIDKtester1: string;

describe.only("OpenBound", () => {
  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    deployer = await getNamedSigner("deployer");
    tester1 = await getNamedSigner("tester1");
  });

  beforeEach(async () => {
    await provider.send("hardhat_reset", []);

    if (chainId === 31337) await deployments.fixture(["OpenBound"]);

    openBound = (await getContract("OpenBound", deployer)) as unknown as OpenBound;

    tokenID0deployer = String(await openBound.getTokenID(cidUint0, deployer.address));
    tokenIDKdeployer = String(await openBound.getTokenID(cidUintK, deployer.address));
    tokenID0tester1 = String(await openBound.connect(tester1).getTokenID(cidUint0, tester1.address));
    tokenIDKtester1 = String(await openBound.connect(tester1).getTokenID(cidUintK, tester1.address));
  });

  describe("Setup", () => {
    let firstTokenID: BigNumber;

    beforeEach(async () => {
      if (chainId === 31337) {
        await openBound.mint(cidUint0);
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

  describe("Mint", () => {
    it("Should Mint token", async () => {
      await expect(openBound.mint(0)).to.be.not.reverted;
    });

    it("Should Mint up to maxSupply", async () => {
      const maxSupply = Number(await openBound.maxSupply());
      for (let i = 0; i < maxSupply; i++) {
        const signer = Wallet.createRandom().connect(provider);
        await provider.send("hardhat_setBalance", [signer.address, "0x1000000000000000"]);
        await expect(openBound.connect(signer).mint(i)).to.be.not.reverted;
      }

      expect(await openBound.totalSupply()).to.be.equal(maxSupply);
      await expect(openBound.mint(99)).to.be.revertedWith("Max supply reached");
    });

    it("Should mint OK", async () => {
      await expect(openBound.mint(cidUint0)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenID0deployer);

      await expect(openBound.connect(tester1).mint(cidUintK)).to.be.not.reverted;
      expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIDKtester1);
    });

    it("Should mint KO", async () => {
      await openBound.mint(cidUintK);
      await expect(openBound.mint(cidUintK)).to.be.revertedWith("Already minted or claimed");
    });

    it("Should get tokenID", async () => {
      await openBound.mint(cidUintK);

      const tokenID = await openBound.tokenByIndex(0);
      const tokenIDOwner = await openBound.tokenOfOwnerByIndex(deployer.address, 0);
      expect(tokenID).to.be.equal(tokenIDOwner);

      expect(tokenID).to.be.equal(tokenIDKdeployer);

      const tokenURI = await openBound.tokenURI(tokenID);
      expect(tokenURI).to.be.equal(ipfsK);
    });
  });

  describe("Burn", () => {
    it("Should burn one in one", async () => {
      expect(await openBound.totalSupply()).to.be.equal(0);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
      await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

      await openBound.mint(cidUint0);

      expect(await openBound.totalSupply()).to.be.equal(1);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenID0deployer);
      expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenID0deployer);

      await openBound.burn(tokenID0deployer);

      expect(await openBound.totalSupply()).to.be.equal(0);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
      await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");
    });

    it("Should burn first in two", async () => {
      expect(await openBound.totalSupply()).to.be.equal(0);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
      await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

      await openBound.mint(cidUint0);
      await openBound.connect(tester1).mint(cidUintK);

      expect(await openBound.totalSupply()).to.be.equal(2);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
      expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenID0deployer);
      expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIDKtester1);
      expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenID0deployer);
      expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIDKtester1);

      await openBound.burn(tokenID0deployer);

      expect(await openBound.totalSupply()).to.be.equal(1);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
      expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenIDKtester1);
      await expect(openBound.tokenByIndex(1)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");
      expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIDKtester1);
    });

    it("Should burn second in two", async () => {
      expect(await openBound.totalSupply()).to.be.equal(0);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(0);
      await expect(openBound.tokenByIndex(0)).to.be.revertedWith("Invalid index");
      await expect(openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.revertedWith("Invalid index");

      await openBound.mint(cidUint0);
      await openBound.connect(tester1).mint(cidUintK);

      expect(await openBound.totalSupply()).to.be.equal(2);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
      expect(await openBound.balanceOf(tester1.address)).to.be.equal(1);
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenID0deployer);
      expect(await openBound.tokenByIndex(1)).to.be.equal(tokenIDKtester1);
      expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenID0deployer);
      expect(await openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.equal(tokenIDKtester1);

      await openBound.connect(tester1).burn(tokenIDKtester1);

      expect(await openBound.totalSupply()).to.be.equal(1);
      expect(await openBound.balanceOf(deployer.address)).to.be.equal(1);
      expect(await openBound.balanceOf(tester1.address)).to.be.equal(0);
      expect(await openBound.tokenByIndex(0)).to.be.equal(tokenID0deployer);
      await expect(openBound.tokenByIndex(1)).to.be.revertedWith("Invalid index");
      expect(await openBound.tokenOfOwnerByIndex(deployer.address, 0)).to.be.equal(tokenID0deployer);
      await expect(openBound.tokenOfOwnerByIndex(tester1.address, 0)).to.be.revertedWith("Invalid index");
    });

    it("Should burn second in two bis", async () => {
      await openBound.connect(deployer).mint(cidUint0);
      await openBound.connect(tester1).mint(cidUintK);

      await openBound.connect(deployer).burn(tokenID0deployer);
      await expect(openBound.connect(tester1).burn(tokenIDKtester1)).to.be.not.reverted;
    });
  });

  describe("TokenID", () => {
    it("Should get tokenID0 deployer", async () => {
      const getTokenID0 = await openBound.getTokenID(cidUint0, deployer.address);
      await openBound.mint(cidUint0);
      const tokenID0 = await openBound.tokenOfOwnerByIndex(deployer.address, 0);
      const tokenURI0 = await openBound.tokenURI(tokenID0);

      expect(tokenID0).to.be.equal(getTokenID0);
      expect(tokenID0).to.be.equal(tokenID0deployer);
      expect(tokenURI0).to.be.equal(ipfs0);
    });

    it("Should get tokenID0 tester1", async () => {
      const getTokenID0 = await openBound.getTokenID(cidUint0, tester1.address);
      await openBound.connect(tester1).mint(cidUint0);
      const tokenID0 = await openBound.tokenOfOwnerByIndex(tester1.address, 0);
      const tokenURI0 = await openBound.tokenURI(tokenID0);

      expect(tokenID0).to.be.equal(getTokenID0);
      expect(tokenID0).to.be.equal(tokenID0tester1);
      expect(tokenURI0).to.be.equal(ipfs0);
    });

    it("Should get tokenIDK deployer", async () => {
      const getTokenIDK = await openBound.getTokenID(cidUintK, deployer.address);
      await openBound.mint(cidUintK);
      const tokenIDK = await openBound.tokenOfOwnerByIndex(deployer.address, 0);
      const tokenURIK = await openBound.tokenURI(tokenIDK);

      expect(tokenIDK).to.be.equal(getTokenIDK);
      expect(tokenIDK).to.be.equal(tokenIDKdeployer);
      expect(tokenURIK).to.be.equal(ipfsK);
    });

    it("Should get tokenIDK tester1", async () => {
      const getTokenIDK = await openBound.getTokenID(cidUintK, tester1.address);
      await openBound.connect(tester1).mint(cidUintK);
      const tokenIDK = await openBound.tokenOfOwnerByIndex(tester1.address, 0);
      const tokenURIK = await openBound.tokenURI(tokenIDK);

      expect(tokenIDK).to.be.equal(getTokenIDK);
      expect(tokenIDK).to.be.equal(tokenIDKtester1);
      expect(tokenURIK).to.be.equal(ipfsK);
    });

    it("Should get different tokenID0", async () => {
      const getTokenID0deployer = await openBound.getTokenID(cidUint0, deployer.address);
      const getTokenID0tester1 = await openBound.getTokenID(cidUint0, tester1.address);

      expect(getTokenID0deployer).to.be.not.equal(getTokenID0tester1);
    });

    it("Should get different tokenIDK", async () => {
      const getTokenIDKdeployer = await openBound.getTokenID(cidUint0, deployer.address);
      const getTokenIDKtester1 = await openBound.getTokenID(cidUintK, tester1.address);

      expect(getTokenIDKdeployer).to.be.not.equal(getTokenIDKtester1);
    });
  });

  describe("MyTokenID", () => {
    it("Should get my tokenID0 deployer", async () => {
      const getTokenID0 = await openBound.getTokenID(cidUint0, deployer.address);
      const getMyTokenID0 = await openBound.getMyTokenID(cidUint0);
      expect(getTokenID0).to.be.equal(getMyTokenID0);
    });
  });

  describe("CID", () => {
    it("Should get CID", async () => {
      const CID = 42;
      await openBound.mint(CID);
      const tokenID = await openBound.tokenOfOwnerByIndex(deployer.address, 0);

      const getCID = await openBound.getCID(tokenID);
      expect(getCID).to.be.equal(CID);
    });
  });

  describe("Pause", () => {
    it("Should pause mint", async () => {
      await openBound.togglePause();
      await expect(openBound.mint(0)).to.be.revertedWith("Paused !");
      await openBound.togglePause();
      await expect(openBound.mint(0)).to.be.not.reverted;
    });

    it("Should pause claim", async () => {
      const tokenID = await openBound.getMyTokenID(0);
      await openBound.togglePause();
      await expect(openBound.claim(tokenID, 0)).to.be.revertedWith("Paused !");
      await openBound.togglePause();
      await expect(openBound.claim(tokenID, 0)).to.be.not.reverted;
    });

    it("Should toggle pause", async () => {
      let paused = await openBound.paused();
      expect(paused).to.be.false;
      await openBound.togglePause();
      paused = await openBound.paused();
      expect(paused).to.be.true;
      await openBound.togglePause();
      paused = await openBound.paused();
      expect(paused).to.be.false;
    });

    it("Should not pause when not owner", async () => {
      await expect(openBound.connect(tester1).togglePause()).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
