// npx mocha 4-thegraph.mjs
import { expect } from "chai";
import Ipfs from "../../lib/kipfs";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch as any;
global.FormData = FormData as any;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "Qmdzo9j2hH75iRuGRP61BQEwj7WF1p5EtJxChz7b7W3aBc";

describe("TheGraph : Add Json", async function () {
  it("Add Image should return given CID", async function () {
    const theGraph = new Ipfs(theGraphEndpoint);
    expect(await theGraph.addUrl(imgUrl)).to.be.equal(imgCID);
  });
});
