import type { Signer } from "@ethersproject/abstract-signer";
import type { InterfacesIds } from "types/InterfacesIds";

import { getChainId, ethers, deployments, network } from "hardhat";
import { interfaceId } from "lib/kconfig";

import IERC165 from "abis/erc/IERC165.json";

import IERC721 from "abis/erc/IERC721.json";
import IERC721Enumerable from "abis/erc/IERC721Enumerable.json";
import IERC721Metadata from "abis/erc/IERC721Metadata.json";
import IERC721TokenReceiver from "abis/erc/IERC721TokenReceiver.json";

import IERC1155 from "abis/erc/IERC1155.json";
import IERC1155MetadataURI from "abis/erc/IERC1155MetadataURI.json";
import IERC1155TokenReceiver from "abis/erc/IERC1155TokenReceiver.json";

import IERC173 from "abis/erc/IERC173.json";

import IOpenNFTs from "abis/new/IOpenNFTs.json";
import IOpenNFTsV0 from "abis/deployed/IOpenNFTsV0.json";
import IOpenNFTsV1 from "abis/deployed/IOpenNFTsV1.json";
import IOpenNFTsV2 from "abis/deployed/IOpenNFTsV2.json";
import IOpenNFTsV3 from "abis/new/IOpenNFTsV3.json";

import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactoryV2 from "abis/new/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/new/INFTsFactoryV2.json";

import { BigNumber } from "ethers";
import { expect } from "chai";

const setup = deployments.createFixture(async (): Promise<{ contract: InterfacesIds; signer: Signer }> => {
  await deployments.fixture("InterfacesIds");

  const signer = await ethers.getNamedSigner("deployer");
  const contract: InterfacesIds = await ethers.getContract("InterfacesIds", signer);

  return { contract, signer };
});

describe("02 Call interfacesId", () => {
  let chainId: number;
  // let signer: Signer;
  let contract: InterfacesIds;
  let ids: Array<string>;

  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

    ({ contract } = await setup());
  });

  it("Contract should be OK", () => {
    expect(contract.address).to.be.properAddress;
  });

  it("Config should have same interfaceId than solidity", async () => {
    ids = await contract.ids();
    console.log(ids);
    expect(ids[0]).to.be.equal(interfaceId(IERC165));

    expect(ids[1]).to.be.equal(interfaceId(IERC721));
    expect(ids[2]).to.be.equal(interfaceId(IERC721TokenReceiver));
    expect(ids[3]).to.be.equal(interfaceId(IERC721Metadata));
    expect(ids[4]).to.be.equal(interfaceId(IERC721Enumerable));

    expect(ids[5]).to.be.equal(interfaceId(IERC1155));
    expect(ids[6]).to.be.equal(interfaceId(IERC1155TokenReceiver));
    expect(ids[7]).to.be.equal(interfaceId(IERC1155MetadataURI));

    expect(ids[8]).to.be.equal(interfaceId(IERC173));

    expect(ids[9]).to.be.equal(interfaceId(IOpenNFTs));
    expect(ids[10]).to.be.equal(interfaceId(IOpenNFTsV0));
    expect(ids[11]).to.be.equal(interfaceId(IOpenNFTsV1));
    expect(ids[12]).to.be.equal(interfaceId(IOpenNFTsV2));
    expect(ids[13]).to.be.equal(interfaceId(IOpenNFTsV3));

    expect(ids[14]).to.be.equal(interfaceId(ICloneFactory));
    expect(ids[15]).to.be.equal(interfaceId(INFTsFactory));
    expect(ids[16]).to.be.equal(interfaceId(ICloneFactoryV2));
    expect(ids[17]).to.be.equal(interfaceId(INFTsFactoryV2));
  });

  it("Should test interfaceId speed", async () => {
    const n = 1000;
    console.log("start", n);
    for (let i = 0; i < n; i++) {
      const id = interfaceId(IERC721);
    }
    console.log("end", n, interfaceId(IERC721));
  });
});
