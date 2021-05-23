// npx mocha nft-list.mjs --experimental-json-modules
import { expect } from "chai";
import nft from "../lib/nft.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

describe("NFT", async function () {
  this.timeout(10000);
  let l0, l1, l2;

  it("Should init NFT library", async function () {
    const network = await nft.init("0x89");
    expect(network.chainName).to.be.equal("matic");
  });

  // it("Should list NFTs", async function () {
  //   const nfts = await nft.list();
  //   l0 = nfts.length;

  //   expect(l0).to.be.gt(1);
  // });

  // it("Should list NFTs via GraphQL Query", async function () {
  //   const nfts = await nft.listTheGraph();
  //   expect((l1 = nfts.length)).to.be.gt(1);
  // });

  it("Should list NFTs via SmartContract", async function () {
    const nfts = await nft.listContract();
    console.log(nfts);
    expect((l2 = nfts.length)).to.be.gt(1); // expect(l).to.be.equal(l0);
  });

  // it("Should count as much NFTs with each method", async function () {
  //   // expect(l1).to.be.equal(l0);
  //   expect(l2).to.be.equal(l1);
  // });
});
