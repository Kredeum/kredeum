import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Signer, Contract } from "ethers";

describe("OpenPass", function () {
  let signer: Signer;
  let signerAddress: string;
  let template: Contract;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress, "\n");

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull("OpenPass"))) {
      console.log("Deploy OpenPass...");
      await deployments.fixture(["OpenPass"]);
    }

    template = await ethers.getContract("OpenPass", signer);
    console.log("contract", template.address, "\n");
  });

  it("Should be ok", function () {
    expect(signerAddress).to.be.properAddress;
    expect(template.address).to.be.properAddress;
  });
});
