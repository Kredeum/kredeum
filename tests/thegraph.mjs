// npx mocha tests/nft-storage.mjs
import { expect } from "chai";
import TheGraph from "../lib/thegraph.mjs";
import fetch from "node-fetch";
global.fetch = fetch;

const txt = "Bonjour le monde";
const txtCID = "bafkreicnyrnv5u66eavfne6je3fpsw6zoef66t7f7mlkdqskbdwufduk4a";
const key = process.env.NFT_STORAGE_KEY;
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "bafkreiaxjwwnei7m2wtpdyhktr5mpjs6askiqijvhl7ui2kcoffc5mwa5e";
const jsn = { json: "file" };
const jsnCID = "bafkreidnojnd2xzyjtlim2v5wmbnokqdzkjt4hgedzutwucxnutsht3gmy";

describe("NftStorage Add Text", async function () {
  this.timeout(10000);

  it("Add text should return given CID", async function () {
    const theGraph = new TheGraph();
    expect(await theGraph.addUrl(imgUrl)).to.be.equal(imgCID);
  });
});
