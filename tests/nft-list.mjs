// npx mocha nft-list.mjs --experimental-json-modules
import { expect } from "chai";
import OpenNfts from "../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

describe("NFT", async function () {
  this.timeout(10000);
  let openNfts, l0, l1, l2;

  it("Should init NFT library", async function () {
    openNfts = new OpenNfts("0x89");
    expect(openNfts.network.chainName).to.be.equal("matic");
  });

  it("Should list NFTs via GraphQL Query", async function () {
    const nfts = await openNfts.listTheGraph(); //array
    expect((l1 = nfts.length)).to.be.gt(1);
  });

  // it("Should list NFTs via SmartContract", async function () {
  //   const nfts = await openNfts.listContract(); // arrray
  //   l2 = nfts.length;
  //   expect(l2).to.be.gt(1); // expect(l).to.be.equal(l0);
  // });

  it("Should list NFTs", async function () {
    const nfts = await openNfts.list(); // map
    expect((l0 = nfts.size)).to.be.gt(1);
  });

  // it("Should count as much NFTs with both method", async function () {
  //   expect(l1).to.be.equal(l0);
  //   expect(l2).to.be.equal(l1);
  // });
});
