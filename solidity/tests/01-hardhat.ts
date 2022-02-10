import { expect } from "chai";
import { ethers, network, hardhatArguments, config, getChainId } from "hardhat";

describe("01 HardHat environment", function () {
  it("Should get accounts", async function () {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
      expect(await account.getAddress()).to.be.properAddress;
    }
    expect(accounts.length).to.be.gt(0);
  });

  it("Should get network name", function () {
    expect(network.name).to.be.equal(hardhatArguments.network || config.defaultNetwork);
  });

  it("Should get chainId", async function () {
    const chainId = await getChainId();
    expect(Number(chainId)).to.be.gt(0);
  });

  it("Should get block number", async function () {
    const blockNumber = await ethers.provider.getBlockNumber();
    expect(blockNumber).to.be.gte(0);
  });
});
