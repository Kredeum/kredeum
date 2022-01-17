import type { Signer } from "ethers";

import { expect } from "chai";
import { collectionClone } from "lib/kcollection-clone";
// import { ethers } from "ethers";
import { ethers, getChainId } from "hardhat";

describe("Clone collection", function () {
  let signer: Signer;
  let chainId: number;

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    chainId = Number(await getChainId());
  });

  // beforeEach(() => {});

  it("Should be ok", function () {
    expect(true).to.be.true;
  });

  it("Should clone collection", async function () {
    // const collectionClone = async (chainId: number, _name: string, _cloner: Signer): Promise<string> => {
    const result = await collectionClone(chainId, "Test clone collection", signer);
    console.log("collectionClone ~ result", result);
  });
});
