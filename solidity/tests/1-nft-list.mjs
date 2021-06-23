// npx mocha nft-list.mjs --experimental-json-modules
import { expect } from "chai";
import OpenNfts from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
const contract1 = "0x17fb61016939409e6b7cd7cfae468b707a896bae";
const contract2 = "0x02feb47bfd082f76c757c3a750ea10807c529e5f";
const contract3 = "0x98d333dB22158f01797bc7B219c6F18924D0Ca16";

const chainId = "0x13881";
const network = "mumbai";

let openNfts, l0, l1, l2, l3;

describe("NFTs List : Init", async function () {
  it("Should init NFT library with first contract", async function () {
    openNfts = await OpenNfts(chainId, contract1);
    expect(openNfts.ok).to.be.true;
    expect(await openNfts.configNetwork.chainName).to.be.equal(network);
    expect(openNfts.currentContract).to.not.be.empty;
  });

  it("Should init NFT library with second contract", async function () {
    openNfts = await OpenNfts(chainId, contract2);
    // console.log("res", res);
    // console.log("openNfts", openNfts);
    expect(openNfts.ok).to.be.true;
    expect(await openNfts.configNetwork.chainName).to.be.equal(network);
    expect(openNfts.currentContract).to.not.be.empty;
  });
});

describe("NFTs List : List Tokens", async function () {
  it("Should init NFT library", async function () {
    openNfts = await OpenNfts(chainId, contract2);
    expect(openNfts.ok).to.be.true;
  });

  it("Should list NFTs with TheGraph", async function () {
    const nfts = await openNfts.listTokensFromTheGraph(owner); //array
    expect((l1 = nfts.length)).to.be.gt(1);
  });

  it("Should list NFTs with SmartContract", async function () {
    const nfts = await openNfts.listTokensFromContract(owner); // arrray
    l2 = nfts.length;
    expect(l2).to.be.gt(1); // expect(l).to.be.equal(l0);
  });

  it("Should list NFTs with Covalent API", async function () {
    const nfts = await openNfts.listTokensFromCovalent(owner);
    expect((l1 = nfts.length)).to.be.gt(1);
  });

  it("Should list NFTs", async function () {
    const nfts = await openNfts.listTokens(owner);
    expect((l0 = nfts.length)).to.be.gt(1);
  });

  it("Should count as much NFTs with both method", async function () {
    expect(l1).to.be.equal(l0);
    expect(l2).to.be.equal(l1);
  });
});

describe("NFTs List : List Contracts", async function () {
  it("Should init NFT library", async function () {
    openNfts = await OpenNfts(chainId, contract2);
    expect(openNfts.ok).to.be.true;
  });

  it("Should list NFT contracts with TheGraph", async function () {
    const nftContracts = await openNfts.listContractsFromTheGraph(owner);
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });

  it("Should list NFT Contracts with Covalent API", async function () {
    const nftContracts = await openNfts.listContractsFromCovalent(owner);
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });
});

describe("NFTs List : With owner or contract", async function () {
  it("Should init NFT library", async function () {
    openNfts = await OpenNfts(chainId, contract1);
    expect(openNfts.ok).to.be.true;
  });
  it("Should list NFTs of owner", async function () {
    const nfts = await openNfts.listTokens(owner);
    expect((l0 = nfts.length)).to.be.gt(1);
  });
  it("Should list no NFTs with no owner", async function () {
    const nfts = await openNfts.listTokens();
    console.log(nfts);
    expect((l1 = nfts.length)).to.be.equal(0);
  });
  it("Should list NFTs of owner with subgraph", async function () {
    const nfts = await openNfts.listTokensFromTheGraph(owner);
    expect((l2 = nfts.length)).to.be.equal(l0);
  });
  it("Should list all NFTs with subgraph", async function () {
    const nfts = await openNfts.listTokensFromTheGraph();
    expect((l3 = nfts.length)).to.be.equal(2);
  });
  it("Should list NFTs of owner with contract", async function () {
    const nfts = await openNfts.listTokensFromContract(owner);
    expect((l2 = nfts.length)).to.be.equal(l0);
  });
  it("Should list all NFTs with contract", async function () {
    const nfts = await openNfts.listTokensFromContract();
    expect((l3 = nfts.length)).to.be.equal(l3);
  });
});
