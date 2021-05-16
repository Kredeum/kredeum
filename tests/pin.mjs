// npx mocha tests/nft-storage.mjs
import { expect } from "chai";
import pin from "../lib/pin.mjs";

const txt = "Bonjour le monde";
const txtCID = "bafybeic2defbqe6j3swepixdfeyrmx6l3pk3fch3uqbkwtxl7gzs4pspwu";
const token = process.env.NFT_STORAGE_KEY;
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "bafybeid6lyb42fm2yabxi7ur2sea4fdokikuidkyqwy54lzcytfxn44yra";
const jsn = { json: "file" };
const jsnCID = "bafybeidyaf5zduqk2lsfiikpanmxmqs2imamfrz2kwnnovvmvv6pq3wcge";

describe("Pin Image", async function () {
  this.timeout(10000);

  // it("Should pin image with init", async function () {
  //   pin.init({ key: process.env.NFT_STORAGE_KEY });
  //   expect(await pin.url(imgUrl)).to.be.equal(imgCID);
  // });

  // it("Should not pin image  with bad init", async function () {
  //   pin.init();
  //   expect(await pin.url(imgUrl)).to.be.equal("missing token");
  // });

  it("Should pin image with key", async function () {
    expect(await pin.url(imgUrl, { key: process.env.NFT_STORAGE_KEY })).to.be.equal(imgCID);
  });
});

describe("Pin Json", async function () {
  this.timeout(10000);

  it("Should pin Json", async function () {
    expect(await pin.json(jsn, { key: process.env.NFT_STORAGE_KEY })).to.be.equal(jsnCID);
  });
});
