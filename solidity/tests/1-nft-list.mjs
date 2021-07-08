// npx mocha --experimental-json-modules 1-nft-list.mjs
import { expect } from "chai";
import OpenNFTs from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
// const owner = "0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c";

const chainId1 = "0x13881";
const chainId2 = "0x89";
const network1 = "mumbai";
const network2 = "matic";
const contract1 = "0x17fb61016939409e6b7cd7cfae468b707a896bae";
const contract2 = "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253";

let openNFTs, l0, l1, l2, l3;

describe("NFTs List : Init", async function () {
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should set network1", async function () {
    expect(openNFTs.setNetwork(chainId1)).to.be.equal(network1);
  });

  it("Should set contract1", async function () {
    openNFTs.setContract(contract1);
    expect(openNFTs.address).to.be.equal(contract1);
  });

  it("Should set Owner", async function () {
    openNFTs.setOwner(owner);
    expect(openNFTs.owner).to.be.equal(owner);
  });

  it("Should set network2", async function () {
    expect(openNFTs.setNetwork(chainId2)).to.be.equal(network2);
  });

  it("Should set contract2", async function () {
    openNFTs.setContract(contract2);
    expect(openNFTs.address).to.be.equal(contract2);
  });
});

describe("NFTs List : List NFTs with default method", async function () {
  this.timeout(10000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should list NFTs with default method", async function () {
    const nfts = await openNFTs.listNFTs();
    expect((l0 = nfts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List NFTs with TheGraph", async function () {
  this.timeout(10000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should list NFTs with TheGraph", async function () {
    const nfts = await openNFTs.listNFTsFromTheGraph();
    expect((l1 = nfts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List NFTs with Covalent", async function () {
  this.timeout(20000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should list NFTs with Covalent API", async function () {
    const nfts = await openNFTs.listNFTsFromCovalent();
    expect((l2 = nfts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List NFTs with SmartContract", async function () {
  this.timeout(20000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should init SmartContract", async function () {
    await openNFTs.initContract();
    expect(Boolean(openNFTs.contract)).to.be.true;
  });

  it("Should list NFTs with SmartContract", async function () {
    const nfts = await openNFTs.listNFTsFromContract();
    expect((l3 = nfts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List NFTs should give same results", async function () {
  it("Should count as much NFTs with all method", async function () {
    expect(l0).to.be.equal(l1);
    expect(l0).to.be.equal(l2);
    expect(l0).to.be.equal(l3);
  });
});

describe("NFTs List : List Contracts with default method", async function () {
  this.timeout(20000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });
  it("Should list NFT Contracts with default method", async function () {
    const nftContracts = await openNFTs.listContracts();
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List Contracts with The Graph", async function () {
  this.timeout(20000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });

  it("Should list NFT contracts with TheGraph", async function () {
    const nftContracts = await openNFTs.listContractsFromTheGraph();
    expect((l1 = nftContracts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List Contracts with Covalent API", async function () {
  this.timeout(20000);
  it("Should init NFT library", async function () {
    openNFTs = new OpenNFTs();
    openNFTs.setNetwork(chainId1);
    openNFTs.setContract(contract1);
    openNFTs.setOwner(owner);
    expect(Boolean(openNFTs)).to.be.true;
  });
  it("Should list NFT Contracts with Covalent API", async function () {
    const nftContracts = await openNFTs.listContractsFromCovalent();
    expect((l2 = nftContracts.length)).to.be.gt(1);
  });
});

describe("NFTs List : List contracts should give same results", async function () {
  it("Should count as much NFTs contracts with all method", async function () {
    console.log("List contracts with SubGraph", l1, "with Covalent", l2);
    // expect(l2).to.be.equal(l1);
  });
});
