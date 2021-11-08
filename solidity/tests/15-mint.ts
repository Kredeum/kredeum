// npx mocha --experimental-json-modules 2-mint.mjs
import { utils } from "ethers";
import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { networks, getProvider, getNetwork } from "../../lib/kconfig";

import type { Network } from "../../lib/kconfig";
import type { Provider } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

import { config } from "dotenv";
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";

const contractName = "Original Open NFTs";
const contractSymbol = "NFT";
const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe("NFT Mint", function () {
  describe("Init", function () {
    let ethscan: string | undefined;
    let network: Network | undefined;
    let provider: Provider | undefined;
    let chainId: number;
    let chainName: string;

    before(async () => {
      ({ chainId, name: chainName } = await ethers.provider.getNetwork());
      network = networks.find((nw) => nw.chainId === chainId);
    });

    it("Should find Network", function () {
      expect(network?.chainName).to.be.string;
    });

    it("Should find Chain Explorer", function () {
      ethscan = network?.blockExplorerUrls[0];
      expect(ethscan?.startsWith("http")).to.be.true;
    });

    it("Should connect Provider", function () {
      // network = networks.find((nw) => nw.chainName === networkChainName);
      expect(network).to.not.be.undefined;
      if (network) {
        provider = getProvider(network.chainId);
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
      await (await openNFTs.initialize(contractName, contractSymbol)).wait();
      // console.log(openNFTs.address);
      // console.log(await openNFTs.name());
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
      this.timeout(50000);
      const totalSupply = (await openNFTs.totalSupply()).toNumber();
      const tx = await openNFTs.mintNFT(artistAddress, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1 = (await openNFTs.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + 1);
    });
  });
});
