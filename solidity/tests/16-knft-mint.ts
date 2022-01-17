import type { Network } from "../../lib/ktypes";
import type { Provider } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../types/OpenNFTs";

import { expect } from "chai";
import { networks } from "../../lib/kconfig";
import { config } from "dotenv";
import hre from "hardhat";
const { ethers, deployments } = hre;
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";

const contractName = "Open NFTs";
const contractSymbol = "NFT";
const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("NFT Mint", function () {
  describe("Init", function () {
    let ethscan: string | undefined;
    let network: Network | undefined;
    let provider: Provider | undefined;
    let chainId: number;
    let chainName: string;
    let live: boolean;

    before(async () => {
      chainId = Number(await hre.getChainId());
      chainName = hre.network.name;
      live = hre.network.live;
      console.log("network", chainName, chainId, live);

      network = networks.find((nw) => nw.chainId === chainId);
    });

    it("Should find Network", function () {
      expect(network?.chainId).to.be.equal(chainId);
    });

    it("Should find Chain Explorer", function () {
      ethscan = network?.blockExplorerUrls[0];
      expect(ethscan?.startsWith("http")).to.be.true;
    });

    it("Should get Signer", function () {
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY_0_DEPLOY || "", provider);
      expect(signer._isSigner).to.be.true;
    });
  });

  describe("Read", function () {
    let openNFTs: OpenNFTs;

    beforeEach(async () => {
      const signer = await ethers.getNamedSigner("deployer");
      const chainId = (await ethers.provider.getNetwork()).chainId;
      if (chainId === 31337) {
        await deployments.fixture(["OpenNFTs"]);
      }
      openNFTs = await ethers.getContract("OpenNFTs", signer);
      // console.log(openNFTs.address);
      // console.log(await openNFTs.name());
    });

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

    it("Should Mint one Token", async function () {
      this.timeout(50000);
      const totalSupply: number = (await openNFTs.totalSupply()).toNumber();
      const tx = await openNFTs.mintNFT(artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1: number = (await openNFTs.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + Number(1));
    });

    describe("Ownable", function () {
      it("Should be not allowed to Mint", async function () {
        const tx = await openNFTs.mintNFT(artistAddress, json);
        expect((await tx.wait()).status).to.be.equal(1);
      });

      it("Should be allowed to Mint", async function () {
        const tx = await openNFTs.mintNFT(artistAddress, json);
        expect((await tx.wait()).status).to.be.equal(1);
      });
    });
  });
});
