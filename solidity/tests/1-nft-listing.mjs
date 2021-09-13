// npx mocha --experimental-json-modules 1-nft-list.mjs
import { expect } from "chai";
import OpenNFTs from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
// const owner = "0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c";

const chainId1 = "0x13881";
const chainId2 = "0x89";
const chainIdKo = "0x5858";
const network1 = "mumbai";
const network2 = "matic";
const contract1default = "0x98d333dB22158f01797bc7B219c6F18924D0Ca16";
const contract1 = "0x420c87cf8f6a2869ae8cbcfc3047fdea69517007";
const contract2 = "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253";

let openNFTs;

describe("NFTs Listing", async function () {
  beforeEach(async () => {
    openNFTs = new OpenNFTs();
  });
  describe("Init", async function () {
    it("Should init NFT library", async function () {
      expect(Boolean(openNFTs)).to.be.true;
    });

    it("Should set Contract without address", async function () {
      expect(openNFTs.setContract(chainId1)).to.eql([network1, contract1default]);
    });

    it("Should set Contract with address", async function () {
      expect(openNFTs.setContract(chainId1, contract1)).to.eql([network1, contract1]);
    });

    it("Should set Contract bis", async function () {
      expect(openNFTs.setContract(chainId2)).to.eql([network2, contract2]);
    });

    it("Should not set Contract with invalid chainId", async function () {
      expect(openNFTs.setContract(chainIdKo)).to.eql([undefined, undefined]);
    });

    // test setCo,ntract avec chainId invalide
    it("Should set Owner", async function () {
      openNFTs.setOwner(owner);
      expect(openNFTs.owner).to.be.equal(owner);
    });
  });

  describe("List NFTs", async function () {
    this.timeout(20000);

    beforeEach(async () => {
      openNFTs = new OpenNFTs();
      openNFTs.setOwner(owner);
      const [network, contract] = openNFTs.setContract(chainId1, contract1default);
    });

    it("With default method", async function () {
      expect((await openNFTs.listNFTs()).length).to.be.gt(1);
    });

    it("With TheGraph", async function () {
      expect((await openNFTs.listNFTsFromTheGraph()).length).to.be.gt(1);
    });

    it.skip("With Covalent", async function () {
      expect((await openNFTs.listNFTsFromCovalent()).length).to.be.gt(1);
    });

    it("With SmartContract", async function () {
      await openNFTs.initContract(chainId1, contract1default);
      expect((await openNFTs.listNFTsFromContract()).length).to.be.gt(1);
    });

    it("All methods should give same results", async function () {
      await openNFTs.initContract(chainId1, contract1default);
      const l0 = (await openNFTs.listNFTs()).length;
      expect(l0).to.be.equal((await openNFTs.listNFTsFromTheGraph()).length);
      // expect(l0).to.be.equal((await openNFTs.listNFTsFromCovalent()).length);
      expect(l0).to.be.equal((await openNFTs.listNFTsFromContract()).length);
    });
  });

  describe("List Contracts", async function () {
    beforeEach(async () => {
      openNFTs = new OpenNFTs();
      openNFTs.setOwner(owner);
      const [network, contract] = openNFTs.setContract(chainId1, contract1);
    });

    it("With default method", async function () {
      expect((await openNFTs.listContracts()).length).to.be.gt(1);
    });

    it("With The Graph", async function () {
      expect((await openNFTs.listContractsFromTheGraph()).length).to.be.gt(1);
    });

    it.skip("With Covalent", async function () {
      expect((await openNFTs.listContractsFromCovalent()).length).to.be.gt(1);
    });

    it.skip("Both methods should give same results", async function () {
      expect((await openNFTs.listContractsFromTheGraph()).length + 1).to.be.equal(
        (await openNFTs.listContractsFromCovalent()).length
      );
    });
  });
});
