// npx mocha mint.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";

import { configNetworks, configContracts, getProvider } from "../../lib/config.mjs";

import OpenNfts from "../../lib/open-nfts.mjs";

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";
const networkChainId = "0x13881";
const networkChainName = "mumbai";
const networkExplorer = "https://explorer-mumbai.maticvigil.com";
const contractAddress = "0x34538444A64251c765c5e4c9715a16723CA922D8";
const contractName = "Open NFTs";
const contractSymbol = "NFT";

let signer, network, address, abi, provider, contract, totalSupply, ethscan, openNfts;

describe("Mint Token", function () {
  it("Should find Network", function () {
    network = configNetworks.find((nw) => nw.chainName === networkChainName);
    console.log(network);
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
    console.log(contract);
    expect(contract.address).to.be.equal(contractAddress);
  });

  it("Should connect Contract", async function () {
    this.timeout(20000);
    openNfts = await OpenNfts(networkChainId, contractAddress);
    expect(openNfts.ok).to.be.true;
  });

  it("Should get Contract Name", async function () {
    this.timeout(5000);
    expect(await openNfts.currentContract.name()).to.be.equal(contractName);
  });

  it("Should get Contract Symbol", async function () {
    this.timeout(5000);
    expect(await openNfts.currentContract.symbol()).to.be.equal(contractSymbol);
  });

  it("Should get Contract TotalSupply", async function () {
    this.timeout(5000);
    totalSupply = (await openNfts.currentContract.totalSupply()).toNumber();
    expect(totalSupply).to.be.gt(0);
  });

  it("Should connect Provider", function () {
    provider = getProvider(network);
    expect(provider._isProvider).to.be.true;
  });

  it("Should get Signer", async function () {
    signer = new ethers.Wallet(process.env.ACCOUNT_KEY, provider);
    expect(signer._isSigner).to.be.true;
  });

  it("Should Mint one Token", async function () {
    this.timeout(20000);
    const tx = await openNfts.currentContract
      .connect(signer)
      .mintNFT(process.env.ACCOUNT_ADDRESS, json);
    expect((await tx.wait()).status).to.be.equal(1);
  });

  it("Should get +1 on Contract TotalSupply", async function () {
    const totalSupply1 = (await openNfts.currentContract.totalSupply()).toNumber();
    expect(totalSupply1).to.be.equal(totalSupply + 1);
  });
});
