import { expect } from "chai";

import hre from "hardhat";

import type { NetworkType } from "lib/ktypes";
import type { OpenBound } from "types/OpenBound";
import { networks } from "lib/kconfig";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

let chainId: number;
let network: NetworkType | undefined;
let openBound: OpenBound;
let deployer: SignerWithAddress;
let tester: SignerWithAddress;

describe.only("00 Setup TS", () => {
  before(async () => {
    chainId = Number(await hre.getChainId());
    console.log("network", chainId, hre.network.name, hre.network.live);

    network = networks.find((nw) => nw.chainId === chainId);

    deployer = await hre.ethers.getNamedSigner("deployer");
    tester = await hre.ethers.getNamedSigner("tester1");
    if (chainId === 31337) {
      await hre.deployments.fixture(["OpenBound"]);
    }

    openBound = (await hre.ethers.getContract("OpenBound", deployer)) as unknown as OpenBound;
    // console.log(openNFTsV3.address);
    // console.log(await openNFTsV3.name());
  });

  it("Should be OK", () => {
    expect(true).to.be.true;
  });

  it("Should be deployed", () => {
    expect(openBound.address).to.be.properAddress;
  });
});
