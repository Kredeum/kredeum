import type { Network } from "lib/ktypes";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";
import type { Signer } from "ethers";

import { expect } from "chai";
import { networks } from "lib/kconfig";
import { config } from "dotenv";
import hre from "hardhat";
const { ethers, deployments } = hre;
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";

const contractName = "Open NFTs";
const contractSymbol = "NFT";
const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("30 OpenNFTsV3 Mint", function () {
  let ethscan: string | undefined;
  let network: Network | undefined;
  let chainId: number;
  let deployer: Signer;
  let tester: Signer;
  let openNFTsV3: OpenNFTsV3;
  let cloneOpenNFTsV3: OpenNFTsV3;

  before(async () => {
    chainId = Number(await hre.getChainId());
    console.log("network", chainId, hre.network.name, hre.network.live);

    network = networks.find((nw) => nw.chainId === chainId);

    deployer = await ethers.getNamedSigner("deployer");
    tester = await ethers.getNamedSigner("tester1");
    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV3", "NFTsFactory"]);
    }

    openNFTsV3 = await ethers.getContract("OpenNFTsV3", deployer);
    // console.log(openNFTsV3.address);
    // console.log(await openNFTsV3.name());
  });

  describe("Init", function () {
    it("Should find Network", function () {
      expect(network?.chainId).to.be.equal(chainId);
    });

    it("Should find Chain Explorer", function () {
      ethscan = network?.blockExplorerUrls[0];
      expect(ethscan?.startsWith("http")).to.be.true;
    });
  });

  describe("Read", function () {
    it("Should init Contract", function () {
      expect(Boolean(openNFTsV3)).to.be.true;
    });
    it("Should get Contract Name", async function () {
      expect(await openNFTsV3.name()).to.be.equal(contractName);
    });
    it("Should get Contract Symbol", async function () {
      expect(await openNFTsV3.symbol()).to.be.equal(contractSymbol);
    });
    it("Should get Contract TotalSupply", async function () {
      const totalSupply = (await openNFTsV3.totalSupply())?.toNumber();
      expect(totalSupply).to.be.gte(0);
    });
    it("Should get Contract owner", async function () {
      const owner = await openNFTsV3.owner();
      expect(owner).to.be.properAddress;
    });
  });

  describe("Mint", function () {
    it("Should Mint one Token", async function () {
      this.timeout(50000);
      const totalSupply: number = (await openNFTsV3.totalSupply()).toNumber();
      const tx = await openNFTsV3.mintOpenNFT(artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1: number = (await openNFTsV3.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + Number(1));
    });
  });

  describe("Ownable", function () {
    it("Should be allowed to Mint", async function () {
      await expect(openNFTsV3.connect(deployer).mintOpenNFT(artistAddress, json)).to.be.not.reverted;
    });

    it("Should not be allowed to Mint", async function () {
      await expect(openNFTsV3.connect(tester).mintOpenNFT(artistAddress, json)).to.be.revertedWith("Not minter");
    });
  });
});
