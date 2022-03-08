import type { Signer } from "@ethersproject/abstract-signer";
import type { InterfacesIds } from "types/InterfacesIds";

import { getChainId, ethers, deployments, network } from "hardhat";
import { interfaceId } from "lib/kconfig";

import IERC165 from "abis/IERC165.json";

import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IERC721TokenReceiver from "abis/IERC721TokenReceiver.json";

import IERC1155 from "abis/IERC1155.json";
import IERC1155MetadataURI from "abis/IERC1155MetadataURI.json";
import IERC1155TokenReceiver from "abis/IERC1155TokenReceiver.json";

import IERC173 from "abis/IERC173.json";

import IOpenNFTs from "abis/IOpenNFTs.json";
import IOpenNFTsV0 from "abis/IOpenNFTsV0.json";
import IOpenNFTsV1 from "abis/IOpenNFTsV1.json";
import IOpenNFTsV2 from "abis/IOpenNFTsV2.json";
import IOpenNFTsV3 from "abis/IOpenNFTsV3.json";

import ICloneFactory from "abis/ICloneFactory.json";
import INFTsFactory from "abis/INFTsFactory.json";
import ICloneFactoryV2 from "abis/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/INFTsFactoryV2.json";

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

  it("TS script interfaceId should have same result than solidity", async () => {
    ids = await contract.ids();
    console.log(ids);
    expect(ids[0]).to.be.equal(interfaceId(IERC165));

    // console.log("it ~ interfaceId(IERC721)", interfaceId(IERC721));
    // console.log("it ~ ids[1]", ids[1]);
    // console.log("it ~ IERC721", IERC721);
    // expect(ids[1]).to.be.equal(w(IERC721));
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
