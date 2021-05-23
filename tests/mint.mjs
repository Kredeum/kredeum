// npx mocha mint.mjs  --experimental-json-modules
import { ethers } from "ethers";
import { expect } from "chai";

import contracts from "../config/contracts.json";
import networks from "../config/networks.json";

const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";
const networkChainId = "0x13881";
const networkChainName = "mumbai";
const networkExplorer = "https://polygon-explorer-mumbai.chainstacklabs.com";
const contractAddress = "0x34538444A64251c765c5e4c9715a16723CA922D8";
const contractName = "Open NFTs";
const contractSymbol = "NFT";

let signer, network, address, abi, provider, contract, totalSupply, ethscan;

describe("Mint Token", function () {
  it("Should find Network", function () {
    network = networks.find((nw) => nw.chainName === networkChainName);
    expect(network.chainId).to.be.equal(networkChainId);
  });

  it("Should find Chain Explorer", function () {
    ethscan = network.blockExplorerUrls[0];
    expect(ethscan).to.be.equal(networkExplorer);
  });

  it("Should find Contract Address", function () {
    address = contracts.v1.instances[networkChainName][0].address;
    expect(address).to.be.equal(contractAddress);
  });

  it("Should find Contract ABI", function () {
    abi = contracts.v1.abi;
    expect(abi[0]).to.be.equal("constructor()");
  });

  it("Should connect Provider", function () {
    provider = new ethers.providers.JsonRpcProvider(`${network.rpcUrls[0]}/${process.env.MATICVIGIL_API_KEY}`);
    expect(provider._isProvider).to.be.true;
  });

  it("Should connect Contract", function () {
    contract = new ethers.Contract(address, abi, provider);
    expect(provider._isProvider).to.be.true;
  });

  it("Should get Contract Name", async function () {
    expect(await contract.name()).to.be.equal(contractName);
  });

  it("Should get Contract Symbol", async function () {
    expect(await contract.symbol()).to.be.equal(contractSymbol);
  });

  it("Should get Contract TotalSupply", async function () {
    totalSupply = (await contract.totalSupply()).toNumber();
    expect(totalSupply).to.be.gt(0);
  });

  it("Should get Signer", async function () {
    signer = new ethers.Wallet(process.env.ACCOUNT_KEY, provider);
    expect(signer._isSigner).to.be.true;
  });

  it("Should Mint one Token", async function () {
    this.timeout(20000);
    const tx = await contract.connect(signer).mintNFT(process.env.ACCOUNT_ADDRESS, json);
    expect((await tx.wait()).status).to.be.equal(1);
  });

  it("Should get +1 on Contract TotalSupply", async function () {
    const totalSupply1 = (await contract.totalSupply()).toNumber();
    expect(totalSupply1).to.be.equal(totalSupply + 1);
  });
});
