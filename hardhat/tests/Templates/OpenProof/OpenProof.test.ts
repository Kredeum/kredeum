import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Signer, Contract } from "ethers";

describe("OpenProof", function () {
  let signer: Signer;
  let signerAddress: string;
  let template: Contract;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress, "\n");

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull("OpenProof"))) {
      console.log("Deploy OpenProof...");
      await deployments.fixture(["OpenProof"]);
    }

    template = await ethers.getContract("OpenProof", signer);
    console.log("contract", template.address, "\n");
  });

  it("Should be ok", function () {
    expect(signerAddress).to.be.properAddress;
    expect(template.address).to.be.properAddress;
  });
});
