// npx mocha nft-list.mjs --experimental-json-modules
import { expect } from "chai";
import OpenNfts from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
const contract1 = "0x17fb61016939409e6b7cd7cfae468b707a896bae";
const contract2 = "0x02feb47bfd082f76c757c3a750ea10807c529e5f";
const chainId = "0x13881";
const network = "mumbai";

describe("NFT", async function () {
  this.timeout(20000);
  let openNfts, l0, l1, l2;

  it("Should init NFT library with second contract", async function () {
    openNfts = await OpenNfts(chainId, contract2);
    expect(openNfts.ok).to.be.true;
    expect(await openNfts.getNetwork()).to.be.equal(network);
    expect(openNfts.smartContract).to.not.be.empty;
  });

  it("Should init NFT library with first contract", async function () {
    openNfts = await OpenNfts(chainId, contract1);
    // console.log("res", res);
    // console.log("openNfts", openNfts);
    expect(openNfts.ok).to.be.true;
    expect(await openNfts.getNetwork()).to.be.equal(network);
    expect(openNfts.smartContract).to.not.be.empty;
  });

  // it("Should list NFTs via GraphQL Query", async function () {
  //   const nfts = await openNfts.listTokensFromTheGraph(owner); //array
  //   expect((l1 = nfts.length)).to.be.gt(1);
  // });

  it("Should list NFTs via SmartContract", async function () {
    const nfts = await openNfts.listTokensFromContract(owner); // arrray
    l2 = nfts.length;
    expect(l2).to.be.gt(1); // expect(l).to.be.equal(l0);
  });

  it("Should list NFTs", async function () {
    const nfts = await openNfts.listTokens(owner); // map
    expect((l0 = nfts.size)).to.be.gt(1);
  });

  // it("Should count as much NFTs with both method", async function () {
  //   expect(l1).to.be.equal(l0);
  //   expect(l2).to.be.equal(l1);
  // });

  // it("Should list NFT contracts", async function () {
  //   const nftContracts = await openNfts.listContracts(owner); // map
  //   expect((l0 = nftContracts.length)).to.be.gt(1);
  // });
});
