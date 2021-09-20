// npx mocha nft-storage.mjs
import { expect } from "chai";
import Ipfs from "../../lib/kipfs";
import NftStorage from "../../lib/nft-storage";

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
global.fetch = fetch as any;

const txt = "Bonjour le monde";
const txtCID = "bafkreicnyrnv5u66eavfne6je3fpsw6zoef66t7f7mlkdqskbdwufduk4a";
const key = process.env.NFT_STORAGE_KEY || "";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "bafkreiaxjwwnei7m2wtpdyhktr5mpjs6askiqijvhl7ui2kcoffc5mwa5e";
const jsn = { json: "file" };
const jsnCID = "bafkreidnojnd2xzyjtlim2v5wmbnokqdzkjt4hgedzutwucxnutsht3gmy";

describe("NftStorage", async function () {
  describe("Add Text", async function () {
    it("Add text should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pin(txt)).to.be.equal(txtCID);
    });

    it("Add text should fail with bad auth key", async function () {
      const nftStorage = new NftStorage("bad_key");
      expect(await nftStorage.pin(txt)).to.be.equal("");
    });
  });

  describe("Add Image", async function () {
    it("Add image should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pinUrl(imgUrl)).to.be.equal(imgCID);
    });
  });

  describe("Add Json", async function () {
    it("Add json should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pinJson(jsn)).to.be.equal(jsnCID);
    });
  });
});
