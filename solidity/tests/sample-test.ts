import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("Token", function () {
  let accounts: Signer[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    console.log(ethers);
  });

  it("should do something right", async function () {
    for (const account of accounts) {
      console.log(await account.getAddress());
    }
  });
});
