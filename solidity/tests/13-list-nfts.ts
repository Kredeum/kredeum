import { expect } from "chai";
import { Mint } from "../../lib/open-nfts";
import fetch from "node-fetch";
import type { Network, Contract } from "../../lib/ktypes";
global.fetch = fetch as any;

import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";

const chainId1 = "0x13881";
const contract1 = "0x98d333dB22158f01797bc7B219c6F18924D0Ca16";
const network1 = {
  chainId: "0x13881",
  chainName: "mumbai",
  contract: contract1,
  openSea: {},
  explorer: "https://mumbai.polygonscan.com"
};
const contract1b = "0x98d333dB22158f01797bc7B219c6F18924D0Ca16";
const network1b = {
  chainId: "0x13881",
  chainName: "mumbai",
  contract: contract1b,
  openSea: {},
  explorer: "https://mumbai.polygonscan.com"
};

const chainId2 = "0x89";
const network2 = {
  chainId: "0x89",
  chainName: "matic",
  contract: "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253",
  openSea: {
    assets: "https://opensea.io/assets/matic",
    kredeum: "https://opensea.io/collection/kredeum-nfts"
  },
  explorer: "https://polygonscan.com"
};

const chainIdKo = "0x5858";

let network: Network | undefined;
let contract: Contract | undefined;

describe("NFTs Listing", async function () {
  // describe("Init", async function () {
  //   beforeEach(async () => {
  //     openNFTs = new OpenNFTs();
  //   });
  //   it("Should init NFT library", async function () {
  //     expect(Boolean(openNFTs)).to.be.true;
  //   });
  //   it("Should set Contract without address", async function () {
  //     ({ network } = await openNFTs.init(chainId1));
  //     expect(network?.chainId).to.be.eq(network1.chainId);
  //     expect(network?.chainName).to.be.eq(network1.chainName);
  //   });
  //   it("Should set Contract with address", async function () {
  //     ({ network, contract } = await openNFTs.init(chainId1, contract1b));
  //     expect(network?.chainId).to.be.eq(network1.chainId);
  //     expect(network?.chainName).to.be.eq(network1.chainName);
  //     expect(contract?.address).to.be.eq(network1.contract);
  //     expect(contract?.address).to.be.eq(contract1b);
  //   });
  //   it("Should set Contract2", async function () {
  //     ({ network, contract } = await openNFTs.init(chainId2));
  //     expect(network?.chainId).to.be.eq(network2.chainId);
  //     expect(network?.chainName).to.be.eq(network2.chainName);
  //     expect(contract?.address).to.be.eq(network2.contract);
  //   });
  //   // test setCo,ntract avec chainId invalide
  //   it("Should set Owner", async function () {
  //     openNFTs.setOwner(owner);
  //     expect(openNFTs.owner).to.be.equal(owner);
  //   });
  // });
  // describe("List NFTs", async function () {
  //   this.timeout(20000);
  //   beforeEach(async () => {
  //     openNFTs = new OpenNFTs();
  //     openNFTs.setOwner(owner);
  //     openNFTs.init(chainId1, contract1);
  //   });
  //   it("With default method", async function () {
  //     expect((await openNFTs.listNFTs()).length).to.be.gt(1);
  //   });
  //   it("With TheGraph", async function () {
  //     expect((await openNFTs.listNFTsFromTheGraph()).length).to.be.gt(1);
  //   });
  //   it.skip("With Covalent", async function () {
  //     expect((await openNFTs.listNFTsFromCovalent()).length).to.be.gt(1);
  //   });
  //   it("With SmartContract", async function () {
  //     await openNFTs.init(chainId1, contract1);
  //     expect((await openNFTs.listNFTsFromContract()).length).to.be.gt(1);
  //   });
  //   it("All methods should give same results", async function () {
  //     await openNFTs.init(chainId1, contract1);
  //     const l0 = (await openNFTs.listNFTs()).length;
  //     expect(l0).to.be.equal((await openNFTs.listNFTsFromTheGraph()).length);
  //     // expect(l0).to.be.equal((await openNFTs.listNFTsFromCovalent()).length);
  //     expect(l0).to.be.equal((await openNFTs.listNFTsFromContract()).length);
  //   });
  // });
  // describe("List Contracts", async function () {
  //   beforeEach(async () => {
  //     openNFTs = new OpenNFTs();
  //     openNFTs.setOwner(owner);
  //     const { network, contract } = await openNFTs.init(chainId1, contract1);
  //   });
  //   it("With default method", async function () {
  //     expect((await openNFTs.listContracts()).length).to.be.gt(1);
  //   });
  //   it("With The Graph", async function () {
  //     expect((await openNFTs.listContractsFromTheGraph()).size).to.be.gt(1);
  //   });
  //   it.skip("With Covalent", async function () {
  //     expect((await openNFTs.listContractsFromCovalent()).size).to.be.gt(1);
  //   });
  //   it.skip("Both methods should give same results", async function () {
  //     expect((await openNFTs.listContractsFromTheGraph()).size + 1).to.be.equal(
  //       (await openNFTs.listContractsFromCovalent()).size
  //     );
  //   });
  // });
});
