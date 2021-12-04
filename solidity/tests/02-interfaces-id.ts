import type { Signer } from "@ethersproject/abstract-signer";
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
    expect(ids[0]).to.be.equal("0x01ffc9a7"); // ERC165
    expect(ids[1]).to.be.equal("0x80ac58cd"); // ERC721
    expect(ids[2]).to.be.equal("0x150b7a02"); // ERC721Receiver
    expect(ids[3]).to.be.equal("0x5b5e139f"); // ERC721Metadata
    expect(ids[4]).to.be.equal("0x780e9d63"); // ERC721Enumerable
    expect(ids[5]).to.be.equal("0x4b68d431"); // OpenNFTsV0
    expect(ids[6]).to.be.equal("0xeacabe14"); // OpenNFTsV1
    expect(ids[7]).to.be.equal("0xd94a1db2"); // OpenNFTsV2
  });
});
