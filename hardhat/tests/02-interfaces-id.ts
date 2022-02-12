import type { Signer } from "@ethersproject/abstract-signer";
import type { IInterfacesIds } from "types/IInterfacesIds";

import { Fragment, Interface } from "@ethersproject/abi";
import { getChainId, ethers, deployments, network } from "hardhat";
import { abis } from "lib/kconfig";
import { BigNumber } from "ethers";
import { expect } from "chai";

const setup = deployments.createFixture(async (): Promise<{ contract: IInterfacesIds; signer: Signer }> => {
  await deployments.fixture("InterfacesIds");

  const signer = await ethers.getNamedSigner("deployer");
  const contract: IInterfacesIds = await ethers.getContract("InterfacesIds", signer);

  return { contract, signer };
});

const interfaceId = (abi: Array<string>): string => {
  const iface = new Interface(abi);

  let id = BigNumber.from(0);
  iface.fragments.forEach((f: Fragment): void => {
    if (f.type === "function") {
      id = id.xor(BigNumber.from(iface.getSighash(f)));
    }
  });
  return ethers.utils.hexlify(id);
};

describe("02 Call interfacesId", () => {
  let chainId: number;
  // let signer: Signer;
  let contract: IInterfacesIds;

  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    ({ contract } = await setup());
  });

  it("Contract should be OK", () => {
    expect(contract.address).to.be.properAddress;
  });

  it("Config should have same interfaceId than solidity", async () => {
    const ids: Array<string> = await contract.ids();
    console.log(ids);
    expect(ids[0]).to.be.equal(abis.ERC165.interfaceId);
    expect(ids[1]).to.be.equal(abis.ERC721.interfaceId);
    expect(ids[2]).to.be.equal(abis.ERC721TokenReceiver.interfaceId);
    expect(ids[3]).to.be.equal(abis.ERC721Metadata.interfaceId);
    expect(ids[4]).to.be.equal(abis.ERC721Enumerable.interfaceId);
    expect(ids[5]).to.be.equal(abis.ERC1155.interfaceId);
    expect(ids[6]).to.be.equal(abis.ERC1155TokenReceiver.interfaceId);
    expect(ids[7]).to.be.equal(abis.ERC1155Metadata_URI.interfaceId);
    expect(ids[8]).to.be.equal(abis.OpenNFTsV0.interfaceId);
    expect(ids[9]).to.be.equal(abis.OpenNFTsV1.interfaceId);
    expect(ids[10]).to.be.equal(abis.OpenNFTsV2.interfaceId);
    expect(ids[11]).to.be.equal(abis.OpenNFTsV3.interfaceId);
  });

  it("Config should have same interfaceId than config abi", () => {
    expect(interfaceId(abis.ERC165.abi)).to.be.equal(abis.ERC165.interfaceId);
    expect(interfaceId(abis.ERC721.abi)).to.be.equal(abis.ERC721.interfaceId);
    expect(interfaceId(abis.ERC721TokenReceiver.abi)).to.be.equal(abis.ERC721TokenReceiver.interfaceId);
    expect(interfaceId(abis.ERC721Metadata.abi)).to.be.equal(abis.ERC721Metadata.interfaceId);
    expect(interfaceId(abis.ERC721Enumerable.abi)).to.be.equal(abis.ERC721Enumerable.interfaceId);
    expect(interfaceId(abis.ERC1155.abi)).to.be.equal(abis.ERC1155.interfaceId);
    expect(interfaceId(abis.ERC1155TokenReceiver.abi)).to.be.equal(abis.ERC1155TokenReceiver.interfaceId);
    expect(interfaceId(abis.ERC1155Metadata_URI.abi)).to.be.equal(abis.ERC1155Metadata_URI.interfaceId);
    expect(interfaceId(abis.OpenNFTsV0.abi)).to.be.equal(abis.OpenNFTsV0.interfaceId);
    expect(interfaceId(abis.OpenNFTsV1.abi)).to.be.equal(abis.OpenNFTsV1.interfaceId);
    expect(interfaceId(abis.OpenNFTsV2.abi)).to.be.equal(abis.OpenNFTsV2.interfaceId);
    expect(interfaceId(abis.OpenNFTsV3.abi)).to.be.equal(abis.OpenNFTsV3.interfaceId);
  });
});
