// npx mocha tests/pinata.mjs
import { expect } from "chai";
import pinataPins from "../lib/pinata.mjs";
import fetch from "node-fetch";
import FormData from "form-data";
global.fetch = fetch;
global.FormData = FormData;

const txt = "Bonjour le monde";
const txtCID = "bafybeic2defbqe6j3swepixdfeyrmx6l3pk3fch3uqbkwtxl7gzs4pspwu";
const key = process.env.NFT_STORAGE_KEY;
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "bafybeid6lyb42fm2yabxi7ur2sea4fdokikuidkyqwy54lzcytfxn44yra";
const jsn = { json: "file" };
const jsnCID = "bafybeidyaf5zduqk2lsfiikpanmxmqs2imamfrz2kwnnovvmvv6pq3wcge";

describe("pinataPins Add Text", async function () {
  this.timeout(10000);

  it("Add text should return given CID", async function () {
    const pinata = new pinataPins(key);
    expect(await pinata.pin(txt)).to.be.equal(txtCID);
  });

  //   it("Add text should fail without auth key", async function () {
  //     const pinata = new pinataPins();
  //     expect(await pinata.pin(txt)).to.be.equal("");
  //   });
});

// describe("pinataPins Add Image", async function () {
//   this.timeout(10000);

//   it("Add image should return given CID", async function () {
//     const pinata = new pinataPins(key);
//     expect(await pinata.pinUrl(imgUrl)).to.be.equal(imgCID);
//   });
// });

// describe("pinataPins Add Json", async function () {
//   this.timeout(10000);

//   it("Add json should return given CID", async function () {
//     const pinata = new pinataPins(key);
//     expect(await pinata.pinJson(jsn)).to.be.equal(jsnCID);
//   });
// });
