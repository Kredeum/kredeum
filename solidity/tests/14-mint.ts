// npx mocha --experimental-json-modules 2-mint.mjs
import { utils } from "ethers";
import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { networks, getProvider, getNetwork } from "../../lib/kconfig";

import type { Network, Contract } from "../../lib/kconfig";
import type { Provider } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

import { config } from "dotenv";
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";
const networkChainId = "0x13881";
const networkChainName = "mumbai";
const networkExplorer = "https://explorer-mumbai.maticvigil.com";
const contractAddress = "0x933E3468e940fb310fFE625E63c42930D2861464";
const contractName = "Open NFTs";
const contractSymbol = "NFT";
const artistAddress = "0x02aa887ae5ee49077f229a9f9a7decda66e516a810b0825de4f6e749224eac9c83";

let ethscan: string | undefined;
let network: Network | undefined;
let contract: Contract | undefined;
let provider: Provider | undefined;

describe("NFT Mint", function () {
  describe("Init", function () {
    it("Should find Network", function () {
      network = networks.find((nw) => nw.chainName === networkChainName);
      console.log(network);
      expect(network?.chainId).to.be.equal(networkChainId);
    });

    it("Should find Chain Explorer", function () {
      ethscan = network?.blockExplorerUrls[0];
      expect(ethscan?.startsWith("https://")).to.be.true;
    });

    it("Should find Contract Config", function () {
      const contract = network?.openNFTs;

      console.log(network);
      console.log(contract);
      expect(contract).to.be.equal(contractAddress);
    });

    it("Should connect Provider", function () {
      network = networks.find((nw) => nw.chainName === networkChainName);
      expect(network).to.not.be.undefined;
      if (network) {
        provider = getProvider(network);
        expect(provider).to.not.be.undefined;
        expect(provider?._isProvider).to.be.true;
      }
    });

    it("Should get Signer", async function () {
      const signer = new ethers.Wallet(process.env.ACCOUNT_KEY || "", provider);
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

      console.log(openNFTs.address);
      console.log(await openNFTs.name());
    });

    it("Should init Contract", async function () {
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
      this.timeout(20000);
      const totalSupply = (await openNFTs?.totalSupply()).toNumber();
      const tx = await openNFTs.mintNFT(artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1 = (await openNFTs?.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + 1);
    });
  });
});
