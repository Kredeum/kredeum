import { expect } from "chai";
import NftStorage from "lib/knft-storage";

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
global.fetch = fetch as any;

const txt = "Bonjour le monde";
const txtCID = "bafkreicnyrnv5u66eavfne6je3fpsw6zoef66t7f7mlkdqskbdwufduk4a";
const key = process.env.NFT_STORAGE_KEY || "";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "bafkreifhd3etz6mwjjlisuvaxj4crzqsu4d36ggp5jkhv4i7nnqx5pu3bi";
const jsn = { json: "file" };
const jsnCID = "bafkreidnojnd2xzyjtlim2v5wmbnokqdzkjt4hgedzutwucxnutsht3gmy";

describe("03 NftStorage", function () {
  describe("Add Text", function () {
    it("Add text should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pin(txt)).to.be.equal(txtCID);
    });

    it("Add text should fail with bad auth key", async function () {
      const nftStorage = new NftStorage("bad_key");
      expect(await nftStorage.pin(txt)).to.be.equal("");
    });
  });

  describe("Add Image", function () {
    it("Add image should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pinUrl(imgUrl)).to.be.equal(imgCID);
    });
  });

  describe("Add Json", function () {
    it("Add json should return given CID", async function () {
      const nftStorage = new NftStorage(key);
      expect(await nftStorage.pinJson(jsn)).to.be.equal(jsnCID);
    });
  });
});
