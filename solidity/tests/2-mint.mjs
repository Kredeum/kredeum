// npx mocha --experimental-json-modules 2-mint.mjs
import { ethers } from "ethers";
import { expect } from "chai";
import { networks, configContracts, getProvider } from "../../lib/config.mjs";
import OpenNFTs from "../../lib/open-nfts.mjs";
import { config } from "dotenv";
config();

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";
const networkChainId = "0x13881";
const networkChainName = "mumbai";
const networkExplorer = "https://explorer-mumbai.maticvigil.com";
const contractAddress = "0x34538444A64251c765c5e4c9715a16723CA922D8";
const contractName = "Open NFTs";
const contractSymbol = "NFT";

let network, provider, contract, ethscan;

describe("NFT Mint", function () {
  describe("Init", function () {
    it("Should find Network", function () {
      network = networks.find((nw) => nw.chainName === networkChainName);
      // console.log(network);
      expect(network.chainId).to.be.equal(networkChainId);
    });

    it("Should find Chain Explorer", function () {
      ethscan = network.blockExplorerUrls[0];
      expect(ethscan.startsWith("https://")).to.be.true;
    });

    it("Should find Contract Config", function () {
      contract = configContracts.find(
        (_contract) => _contract.address.toLowerCase() === contractAddress.toLowerCase()
      );
      // console.log(contract);
      expect(contract.address).to.be.equal(contractAddress);
    });

    it("Should connect Provider", function () {
      network = networks.find((nw) => nw.chainName === networkChainName);
      provider = getProvider(network);
      expect(provider._isProvider).to.be.true;
    });

    it("Should get Signer", async function () {
      const signer = new ethers.Wallet(process.env.ACCOUNT_KEY, provider);
      expect(signer._isSigner).to.be.true;
    });
  });

  describe("Read", function () {
    let openNFTs;

    beforeEach(async () => {
      openNFTs = new OpenNFTs();
      openNFTs.setContract(networkChainId, contractAddress);
      await openNFTs.initContract(networkChainId, contractAddress);
    });

    it("Should init Contract", async function () {
      expect(Boolean(openNFTs)).to.be.true;
    });
    it("Should get Contract Name", async function () {
      expect(await openNFTs.contract.name()).to.be.equal(contractName);
    });
    it("Should get Contract Symbol", async function () {
      expect(await openNFTs.contract.symbol()).to.be.equal(contractSymbol);
    });
    it("Should get Contract TotalSupply", async function () {
      const totalSupply = (await openNFTs.contract.totalSupply())?.toNumber();
      expect(totalSupply).to.be.gt(0);
    });
  });

  describe("Mint", function () {
    this.timeout(20000);

    it("Should Mint one Token", async function () {
      let openNFTs = new OpenNFTs();
      openNFTs.setContract(networkChainId, contractAddress);
      await openNFTs.initContract(networkChainId, contractAddress);
      const signer = new ethers.Wallet(process.env.ACCOUNT_KEY, provider);

      const totalSupply = (await openNFTs.contract.totalSupply()).toNumber();
      const tx = await openNFTs.contract.connect(signer).mintNFT(process.env.ACCOUNT_ADDRESS, json);
      expect((await tx.wait()).status).to.be.equal(1);

      const totalSupply1 = (await openNFTs.contract.totalSupply()).toNumber();
      expect(totalSupply1).to.be.equal(totalSupply + 1);
    });
  });
});
