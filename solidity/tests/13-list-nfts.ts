import { expect } from "chai";
import {
  listNFTs,
  listNFTsFromTheGraph,
  listNFTsFromContract,
  listNFTsFromCovalent,
  getOpenNFTs
} from "../../lib/open-nfts";
import fetch from "node-fetch";
import type { Network, Contract } from "../../lib/ktypes";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

global.fetch = fetch as any;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";

const chainId1 = "0x13881";
const contract1 = "0x2c68ca36Cb543485aD2dDF88350d6d3e4262F0f1";
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
  describe("Should get OpenNFTs", async function () {
    it("With default method", async function () {
      const openNFTs = (await getOpenNFTs(chainId1, contract1)) as OpenNFTs;
      expect(openNFTs.address).to.be.properAddress;
    });
  });

  describe("List NFTs", async function () {
    this.timeout(20000);
    beforeEach(async () => {});

    it("With default method", async function () {
      expect((await listNFTs(chainId1, contract1)).length).to.be.gt(1);
    });
    it("With TheGraph", async function () {
      expect((await listNFTsFromTheGraph(chainId1, contract1)).length).to.be.gt(1);
    });
    it.skip("With Covalent", async function () {
      expect((await listNFTsFromCovalent(chainId1, contract1)).length).to.be.gt(1);
    });
    it("With SmartContract", async function () {
      expect((await listNFTsFromContract(chainId1, contract1)).length).to.be.gt(1);
    });
    it("All methods should give same results", async function () {
      const l0 = (await listNFTs(chainId1, contract1)).length;
      expect(l0).to.be.equal((await listNFTsFromTheGraph(chainId1, contract1)).length);
      // expect(l0).to.be.equal((await listNFTsFromCovalent()).length);
      expect(l0).to.be.equal((await listNFTsFromContract(chainId1, contract1)).length);
    });
  });
});
