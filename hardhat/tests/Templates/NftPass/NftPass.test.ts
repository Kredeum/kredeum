import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Signer, Contract, BigNumber } from "ethers";
import { FeeData, TransactionReceipt } from "@ethersproject/abstract-provider";

describe("NftPass", function () {
  let signer: Signer;
  let signerAddress: string;
  let template: Contract;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress, "\n");

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull("NftPass"))) {
      console.log("Deploy NftPass...");
      await deployments.fixture(["NftPass"]);
    }

    template = await ethers.getContract("NftPass", signer);
    console.log("contract", template.address, "\n");
  });

  afterEach(async () => { });

  it("Should be ok", async function () {
    expect(signerAddress).to.be.properAddress;
    expect(template.address).to.be.properAddress;
  });
});
