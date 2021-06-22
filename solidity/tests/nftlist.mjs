// npx mocha nftlist.mjs --experimental-json-modules
import { expect } from "chai";
import OpenNfts from "../../lib/open-nfts.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
const contract1 = "0x17fb61016939409e6b7cd7cfae468b707a896bae";
const contract2 = "0x02feb47bfd082f76c757c3a750ea10807c529e5f";

const chainId = "0x13881";
const network = "mumbai";

describe("NFT basics", async function () {
  this.timeout(20000);
  let openNfts, l0, l1, l2;

  it("Should init NFT library", async function () {
    openNfts = await OpenNfts(chainId, contract1);
    expect(openNfts.ok).to.be.true;
  });

  it("Should list NFTs via Covalent API", async function () {
    const nfts = await openNfts.listTokensFromCovalent(owner); //array
    expect((l1 = nfts.length)).to.be.gt(1);
  });

  it("Should list NFT contracts via Covalent API", async function () {
    const nftContracts = await openNfts.listContractsFromCovalent(owner);
    expect((l0 = nftContracts.length)).to.be.gt(1);
  });
});
