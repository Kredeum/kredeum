import type { Signer } from "@ethersproject/abstract-signer";
import type { Contract } from "@ethersproject/contracts";
import type { InterfacesIds } from "../artifacts/types/InterfacesIds";
import { expect } from "chai";
import { getChainId, ethers, deployments, network } from "hardhat";

const setup = deployments.createFixture(
  async (): Promise<{ contract: InterfacesIds; signer: Signer }> => {
    await deployments.fixture("InterfacesIds");

    const signer = await ethers.getNamedSigner("deployer");
    const contract: InterfacesIds = await ethers.getContract("InterfacesIds", signer);

    return { contract, signer };
  }
);

describe.only("Call interfacesId", () => {
  let chainId: number;
  // let signer: Signer;
  let contract: InterfacesIds;

  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    ({ contract } = await setup());
  });

  it("Contract should be OK", () => {
    expect(contract.address).to.be.properAddress;
  });

  it("Should be OK", async () => {
    const ids: Array<string> = await contract.ids();
    console.log(ids);
    expect(ids[0]).to.be.equal("0x01ffc9a7");
  });
});
