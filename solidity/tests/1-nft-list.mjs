// npx mocha 1-nft-list.mjs --experimental-json-modules
import { expect } from "chai";
import OpenNFTs from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
const contract1 = "0x17fb61016939409e6b7cd7cfae468b707a896bae";
const contract2 = "0x02feb47bfd082f76c757c3a750ea10807c529e5f";
const contract3 = "0x98d333dB22158f01797bc7B219c6F18924D0Ca16";

const chainId = "0x13881";
const network = "mumbai";

let openNFTs, l0, l1, l2, l3;

describe("NFTs List : Init", async function () {
  it("Should init NFT library with first contract", async function () {
    openNFTs = await OpenNFTs(chainId, contract1);
    console.log(openNFTs);
    expect(openNFTs.ok).to.be.true;
    expect(await openNFTs.network.chainName).to.be.equal(network);
    expect(openNFTs.currentContract).to.not.be.empty;
  });

  it("Should init NFT library with second contract", async function () {
    openNFTs = await OpenNFTs(chainId, contract2);
    // console.log("res", res);
    // console.log("openNFTs", openNFTs);
    expect(openNFTs.ok).to.be.true;
    expect(await openNFTs.network.chainName).to.be.equal(network);
    expect(openNFTs.currentContract).to.not.be.empty;
  });
});

describe("NFTs List : List Tokens", async function () {
  this.timeout(30000);

  it("Should init NFT library", async function () {
    openNFTs = await OpenNFTs(chainId, contract1);
    expect(openNFTs.ok).to.be.true;
  });

  it("Should list NFTs with TheGraph", async function () {
    const nfts = await openNFTs.listNFTsFromTheGraph(owner);
    expect((l1 = nfts.length)).to.be.gt(1);
  });

  it("Should list NFTs with Covalent API", async function () {
    const nfts = await openNFTs.listNFTsFromCovalent(owner);
    expect((l2 = nfts.length)).to.be.gt(1);
  });

  it("Should list NFTs with SmartContract", async function () {
    const nfts = await openNFTs.listNFTsFromContract(owner);
    expect((l3 = nfts.length)).to.be.gt(1); // expect(l).to.be.equal(l0);
  });

  it("Should list NFTs", async function () {
    const nfts = await openNFTs.listNFTs(owner);
    expect((l0 = nfts.length)).to.be.gt(1);
  });

  it("Should count as much NFTs with all method", async function () {
    expect(l0).to.be.equal(l1);
    expect(l0).to.be.equal(l2);
    expect(l0).to.be.equal(l3);
  });
});

describe("NFTs List : List Contracts", async function () {
  this.timeout(30000);

  it("Should init NFT library", async function () {
    openNFTs = await OpenNFTs(chainId, contract2);
    expect(openNFTs.ok).to.be.true;
  });

  it("Should list NFT contracts with TheGraph", async function () {
    const nftContracts = await openNFTs.listContractsFromTheGraph(owner);
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });

  it("Should list NFT Contracts with Covalent API", async function () {
    const nftContracts = await openNFTs.listContractsFromCovalent(owner);
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });
});

describe("NFTs List : with owner or contract", async function () {
  it("Should init NFT library", async function () {
    openNFTs = await OpenNFTs(chainId, contract1);
    expect(openNFTs.ok).to.be.true;
  });
  it("Should list NFTs of owner", async function () {
    const nfts = await openNFTs.listNFTs(owner);
    expect((l0 = nfts.length)).to.be.gt(1);
  });
  it("Should list all NFTs", async function () {
    const nfts = await openNFTs.listNFTs();
    console.log(nfts);
    expect((l1 = nfts.length)).to.be.equal(l0);
  });
  it("Should list NFTs of owner with subgraph", async function () {
    const nfts = await openNFTs.listNFTsFromTheGraph(owner);
    expect((l2 = nfts.length)).to.be.equal(l0);
  });
  it("Should list all NFTs with subgraph", async function () {
    const nfts = await openNFTs.listNFTsFromTheGraph();
    expect((l3 = nfts.length)).to.be.equal(l0);
  });
  it("Should list NFTs of owner with contract", async function () {
    const nfts = await openNFTs.listNFTsFromContract(owner);
    expect((l2 = nfts.length)).to.be.equal(l0);
  });
  it("Should list all NFTs with contract", async function () {
    const nfts = await openNFTs.listNFTsFromContract();
    expect((l3 = nfts.length)).to.be.equal(l0);
  });
});
