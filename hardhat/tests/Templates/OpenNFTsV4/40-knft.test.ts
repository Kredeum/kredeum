import type { NetworkType } from "lib/ktypes";
import type { OpenNFTsV4 } from "soltypes/contracts/open";
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

describe("40 OpenNFTsV4 Mint", function () {
  let ethscan: string | undefined;
  let network: NetworkType | undefined;
  let chainId: number;
  let deployer: Signer;
  let tester: Signer;
  let openNFTsV4: OpenNFTsV4;

  before(async () => {
    chainId = Number(await hre.getChainId());
    // console.log("network", chainId, hre.network.name, hre.network.live);

    network = networks.find((nw) => nw.chainId === chainId);

    deployer = await ethers.getNamedSigner("deployer");
    tester = await ethers.getNamedSigner("tester1");
    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV4", "NFTsFactory"]);
    }

    openNFTsV4 = (await ethers.getContract("OpenNFTsV4", deployer)) as unknown as OpenNFTsV4;
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
      expect(Boolean(openNFTsV4)).to.be.true;
    });
    it("Should get Contract Name", async function () {
      expect(await openNFTsV4.name()).to.be.equal(contractName);
    });
    it("Should get Contract Symbol", async function () {
      expect(await openNFTsV4.symbol()).to.be.equal(contractSymbol);
    });
    it("Should get Contract TotalSupply", async function () {
      const totalSupply = (await openNFTsV4.totalSupply())?.toNumber();
      expect(totalSupply).to.be.gte(0);
    });
    it("Should get Contract owner", async function () {
      const owner = await openNFTsV4.owner();
      expect(owner).to.be.properAddress;
    });
  });

  describe("Mint", function () {
    it("Should Mint one Token", async function () {
      this.timeout(50000);
      const totalSupply: number = (await openNFTsV4.totalSupply()).toNumber();
      const tx = await openNFTsV4["mint(address,string)"](artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1: number = (await openNFTsV4.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + Number(1));
    });
  });

  describe("Ownable", function () {
    it("Should be allowed to Mint", async function () {
      await expect(openNFTsV4.connect(deployer)["mint(address,string)"](artistAddress, json)).to.be.not.reverted;
    });

    // default collection mintable for all...
    it("Should not be allowed to Mint", async function () {
      await expect(openNFTsV4.connect(tester)["mint(address,string)"](artistAddress, json)).to.be.revertedWith(
        "Not owner"
      );
    });
  });
});
