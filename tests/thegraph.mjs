// npx mocha thegraph.mjs
import { expect } from "chai";
import Ipfs from "../lib/ipfs.mjs";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch;
global.FormData = FormData;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "QmWqwE6kWgpX7Gjw281qW54GKYwUtUHt8dBTuzB2QCFYjh";

describe("NftStorage Add Text", async function () {
  this.timeout(10000);

  it("Add Image should return given CID", async function () {
    const theGraph = new Ipfs(theGraphEndpoint);
    expect(await theGraph.addUrl(imgUrl)).to.be.equal(imgCID);
  });
});
