import { expect } from "chai";

import type { Signer } from "@ethersproject/abstract-signer";
import type { InterfacesIds } from "@soltypes/contracts/dev/InterfacesIds";

import { ethers, deployments } from "hardhat";
import { interfaceId } from "@lib/common/kconfig";

import { abis } from "@lib/common/kabis";

const setup = deployments.createFixture(async (): Promise<{ contract: InterfacesIds; signer: Signer }> => {
  await deployments.fixture("InterfacesIds");

  const signer = await ethers.getNamedSigner("deployer");
  const contract = (await ethers.getContract("InterfacesIds", signer)) as unknown as InterfacesIds;

  return { contract, signer };
});

describe("02 Call interfacesId", () => {
  // let signer: Signer;
  let contract: InterfacesIds;
  let ids: Array<string>;

  before(async () => {
    ({ contract } = await setup());
  });

  it("Contract should be OK", () => {
    expect(contract.address).to.be.properAddress;
  });

  it("TS script interfaceId should have same result than solidity", async () => {
    ids = await contract.ids();
    // console.log(ids);

    let i = 0;
    for (const [key, abi] of Object.entries(abis)) {
      console.log(ids[i], interfaceId(abi), key, "\n", abi);
      expect(ids[i]).to.be.equal(interfaceId(abi));
      i++;
    }
    expect(ids[i]).to.be.equal(interfaceId(["function ids() pure returns (bytes4[])"]));
  });

  it("Should test interfaceId speed", () => {
    const n = 1000;
    console.log("start", n);
    for (let i = 0; i < n; i++) {
      interfaceId(abis["IERC721"]);
    }
    console.log("end", n, interfaceId(abis["IERC721"]));
  });
});
