// npx mocha mint.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";
import { networks, configContracts, getProvider } from "../../lib/config.mjs";
import OpenNFTs from "../../lib/open-nfts.mjs";

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";
const networkChainId = "0x13881";
const networkChainName = "mumbai";
const networkExplorer = "https://explorer-mumbai.maticvigil.com";
const contractAddress = "0x34538444A64251c765c5e4c9715a16723CA922D8";
const contractName = "Open NFTs";
const contractSymbol = "NFT";

let signer, network, address, abi, provider, contract, totalSupply, ethscan, openNFTs;

describe("NFT Mint : Init", function () {
  it("Should find Network", function () {
    network = networks.find((nw) => nw.chainName === networkChainName);
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
});

describe("NFT Mint : Read", function () {
  it("Should connect Contract", async function () {
    openNFTs = await OpenNFTs(networkChainId, contractAddress);
    expect(openNFTs.ok).to.be.true;
  });

  it("Should get Contract Name", async function () {
    expect(await openNFTs?.currentContract.name()).to.be.equal(contractName);
  });

  it("Should get Contract Symbol", async function () {
    expect(await openNFTs?.currentContract.symbol()).to.be.equal(contractSymbol);
  });

  it("Should get Contract TotalSupply", async function () {
    totalSupply = (await openNFTs?.currentContract.totalSupply())?.toNumber();
    expect(totalSupply).to.be.gt(0);
  });
});

describe("NFT Mint : Mint", function () {
  network = networks.find((nw) => nw.chainName === networkChainName);

  it("Should init NFT library", async function () {
    openNFTs = await OpenNFTs(networkChainId, contractAddress);
    expect(openNFTs.ok).to.be.true;
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
    totalSupply = (await openNFTs?.currentContract.totalSupply()).toNumber();
    const tx = await openNFTs?.currentContract
      .connect(signer)
      .mintNFT(process.env.ACCOUNT_ADDRESS, json);
    expect((await tx.wait()).status).to.be.equal(1);
  });

  it("Should get +1 on Contract TotalSupply", async function () {
    const totalSupply1 = (await openNFTs?.currentContract.totalSupply()).toNumber();
    expect(totalSupply1).to.be.equal(totalSupply + 1);
  });
});
