import type { Network } from "../../lib/ktypes";
import type { OpenNFTs } from "../types/OpenNFTs";
import type { Signer } from "ethers";

import { collectionClone } from "lib/kcollection-clone";
import { expect } from "chai";
import { abis, networks } from "../../lib/kconfig";
import { config } from "dotenv";
import hre from "hardhat";
const { ethers, deployments } = hre;
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";

const contractName = "Open NFTs";
const contractSymbol = "NFT";
const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("16 NFT Mint", function () {
  let ethscan: string | undefined;
  let network: Network | undefined;
  let chainId: number;
  let chainName: string;
  let live: boolean;
  let deployer: Signer;
  let tester: Signer;
  let openNFTs: OpenNFTs;
  let cloneOpenNFTs: OpenNFTs;

  before(async () => {
    chainId = Number(await hre.getChainId());
    chainName = hre.network.name;
    live = hre.network.live;
    console.log("network", chainName, chainId, live);

    network = networks.find((nw) => nw.chainId === chainId);

    deployer = await ethers.getNamedSigner("deployer");
    tester = await ethers.getNamedSigner("tester1");
    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs", "NFTsFactory"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", deployer);
    // console.log(openNFTs.address);
    // console.log(await openNFTs.name());
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
      expect(Boolean(openNFTs)).to.be.true;
    });
    it("Should get Contract Name", async function () {
      expect(await openNFTs.name()).to.be.equal(contractName);
    });
    it("Should get Contract Symbol", async function () {
      expect(await openNFTs.symbol()).to.be.equal(contractSymbol);
    });
    it("Should get Contract TotalSupply", async function () {
      const totalSupply = (await openNFTs.totalSupply())?.toNumber();
      expect(totalSupply).to.be.gte(0);
    });
  });

  describe("Mint", function () {
    it("Should Mint one Token", async function () {
      this.timeout(50000);
      const totalSupply: number = (await openNFTs.totalSupply()).toNumber();
      const tx = await openNFTs.mint(artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1: number = (await openNFTs.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + Number(1));
    });
  });

  describe("Ownable", function () {
    before(async () => {
      const cloneAddress = await collectionClone(chainId, "Test", deployer);
      cloneOpenNFTs = new ethers.Contract(cloneAddress, abis.OpenNFTsV3.abi, deployer) as OpenNFTs;
    });

    it("Should not be allowed to Mint", async function () {
      await expect(cloneOpenNFTs.connect(tester).mint(artistAddress, json)).to.be.revertedWith(
        "OpenNFTs: caller is not minter"
      );
    });

    it("Should be allowed to Mint", async function () {
      await expect(cloneOpenNFTs.connect(deployer).mint(artistAddress, json)).to.be.not.reverted;
    });
  });
});
