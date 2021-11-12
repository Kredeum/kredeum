/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import Ipfs from "../../lib/kipfs";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch as any;
global.FormData = FormData as any;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "Qmdzo9j2hH75iRuGRP61BQEwj7WF1p5EtJxChz7b7W3aBc";

describe("TheGraph : Add Json", () => {
  it("Add Image should return given CID", async () => {
    const theGraph = new Ipfs(theGraphEndpoint);
    const cid = await theGraph.addUrl(imgUrl);
    console.log(cid);
    expect(cid).to.be.equal(imgCID);
  });
});
