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

let openNFTs, l0, l1, l2, l3;

describe("NFTs Listing", async function () {
  beforeEach(async () => {
    openNFTs = new OpenNFTs();
  });
  describe("Init", async function () {
    it("Should init NFT library", async function () {
      expect(Boolean(openNFTs)).to.be.true;
    });
    it("Should set Contract without address", async function () {
      const [network, contract] = openNFTs.setContract(chainId1);
      expect(network).to.be.equal(network1);
      expect(contract).to.be.equal(contract1default);
    });
    it("Should set Contract with address", async function () {
      const [network, contract] = openNFTs.setContract(chainId1, contract1);
      expect(network).to.be.equal(network1);
      expect(contract).to.be.equal(contract1);
    });
    it("Should set Contract bis", async function () {
      const [network, contract] = openNFTs.setContract(chainId2);
      expect(network).to.be.equal(network2);
      expect(contract).to.be.equal(contract2);
    });
    it("Should not set Contract with invalid chainId", async function () {
      const [network, contract] = openNFTs.setContract(chainIdKo);
      expect(contract).to.be.equal(undefined);
      expect(network).to.be.equal(undefined);
    });
    // test setCo,ntract avec chainId invalide
    it("Should set Owner", async function () {
      openNFTs.setOwner(owner);
      expect(openNFTs.owner).to.be.equal(owner);
    });
  });
  describe("List NFTs", async function () {
    beforeEach(async () => {
      openNFTs = new OpenNFTs();
      openNFTs.setOwner(owner);
      const [network, contract] = openNFTs.setContract(chainId1, contract1);
      this.timeout(20000);
    });

    it("With default method", async function () {
      expect((await openNFTs.listNFTs()).length).to.be.gt(1);
    });
    it("With TheGraph", async function () {
      expect((await openNFTs.listNFTsFromTheGraph()).length).to.be.gt(1);
    });
    it("With Covalent", async function () {
      expect((await openNFTs.listNFTsFromCovalent()).length).to.be.gt(1);
    });
    it("With SmartContract", async function () {
      await openNFTs.initContract(chainId1, contract1);
      expect((await openNFTs.listNFTsFromContract()).length).to.be.gt(1);
    });
    it("All methods Should give same results", async function () {
      await openNFTs.initContract(chainId1, contract1);
      const l0 = (await openNFTs.listNFTs()).length;
      const l1 = (await openNFTs.listNFTsFromTheGraph()).length;
      const l2 = (await openNFTs.listNFTsFromCovalent()).length;
      const l3 = (await openNFTs.listNFTsFromContract()).length;
      expect(l0).to.be.equal(l1);
      expect(l0).to.be.equal(l2);
      expect(l0).to.be.equal(l3);
    });
  });
});

//   describe("List Contracts", async function () {
//     describe("With default method", async function () {
//       this.timeout(20000);
//       it("Should init NFT library", async function () {
//         openNFTs = new OpenNFTs();
//         openNFTs.setContract(chainId1);
//         openNFTs.setContract(contract1);
//         openNFTs.setOwner(owner);
//         expect(Boolean(openNFTs)).to.be.true;
//       });
//       it("Should list NFT Contracts with default method", async function () {
//         const nftContracts = await openNFTs.listContracts();
//         expect((l0 = nftContracts.length)).to.be.gt(1);
//       });
//     });

//     describe("With The Graph", async function () {
//       this.timeout(20000);
//       it("Should init NFT library", async function () {
//         openNFTs = new OpenNFTs();
//         openNFTs.setContract(chainId1);
//         openNFTs.setContract(contract1);
//         openNFTs.setOwner(owner);
//         expect(Boolean(openNFTs)).to.be.true;
//       });

//       it("Should list NFT contracts with TheGraph", async function () {
//         const nftContracts = await openNFTs.listContractsFromTheGraph();
//         expect((l1 = nftContracts.length)).to.be.gt(1);
//       });
//     });

//     describe("With Covalent", async function () {
//       this.timeout(20000);
//       it("Should init NFT library", async function () {
//         openNFTs = new OpenNFTs();
//         openNFTs.setContract(chainId1);
//         openNFTs.setContract(contract1);
//         openNFTs.setOwner(owner);
//         expect(Boolean(openNFTs)).to.be.true;
//       });
//       it("Should list NFT Contracts with Covalent API", async function () {
//         const nftContracts = await openNFTs.listContractsFromCovalent();
//         expect((l2 = nftContracts.length)).to.be.gt(1);
//       });
//     });

//     describe("All methods Should give same results", async function () {
//       it("Should count as much NFTs contracts with all method", async function () {
//         console.log("List contracts with SubGraph", l1, "with Covalent", l2);
//         // expect(l2).to.be.equal(l1);
//       });
//     });
//   });
// });
