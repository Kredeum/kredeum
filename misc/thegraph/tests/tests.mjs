// pnpm dlx mocha tests.mjs  --experimental-json-modules
import { expect } from "chai";

describe("Subgraph Tests", async function () {
  it("Should be OK", async function () {
    expect(true).to.be.true;
  });
});
