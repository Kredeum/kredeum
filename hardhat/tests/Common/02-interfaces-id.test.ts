import type { Signer } from "@ethersproject/abstract-signer";
import type { InterfacesIds } from "soltypes/contracts/dev";

import { ethers, deployments } from "hardhat";
import { interfaceId } from "lib/kconfig";

import abiERC165 from "abis/IERC165.json";

import abiERC721 from "abis/IERC721.json";
import abiERC721Enumerable from "abis/IERC721Enumerable.json";
import abiERC721Metadata from "abis/IERC721Metadata.json";
import abiERC721TokenReceiver from "abis/IERC721TokenReceiver.json";

import abiERC1155 from "abis/IERC1155.json";
import abiERC1155MetadataURI from "abis/IERC1155MetadataURI.json";
import abiERC1155TokenReceiver from "abis/IERC1155TokenReceiver.json";

import abiERC173 from "abis/IERC173.json";

import abiOpenNFTs from "abis/IOpenNFTs.json";
import abiOpenNFTsV0 from "abis/IOpenNFTsV0.json";
import abiOpenNFTsV1 from "abis/IOpenNFTsV1.json";
import abiOpenNFTsV2 from "abis/IOpenNFTsV2.json";
import abiOpenNFTsV3 from "abis/IOpenNFTsV3.json";
import abiOpenNFTsV4 from "abis/IOpenNFTsV4.json";

import abiCloneFactory from "abis/ICloneFactory.json";
import abiNFTsFactory from "abis/INFTsFactory.json";
import abiCloneFactoryV2 from "abis/ICloneFactoryV2.json";
import abiNFTsFactoryV2 from "abis/INFTsFactoryV2.json";

import { expect } from "chai";

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
    const interfaces = {
      abiERC165,
      abiERC721,
      abiERC721TokenReceiver,
      abiERC721Metadata,
      abiERC721Enumerable,
      abiERC1155,
      abiERC1155TokenReceiver,
      abiERC1155MetadataURI,
      abiERC173,
      abiOpenNFTs,
      abiOpenNFTsV0,
      abiOpenNFTsV1,
      abiOpenNFTsV2,
      abiOpenNFTsV3,
      abiOpenNFTsV4,
      abiCloneFactory,
      abiNFTsFactory,
      abiCloneFactoryV2,
      abiNFTsFactoryV2
    };

    let i = 0;
    for (const [key, value] of Object.entries(interfaces)) {
      console.log(ids[i], interfaceId(value), key, "\n", value);
      expect(ids[i]).to.be.equal(interfaceId(value));
      i++;
    }
  });

  it("Should test interfaceId speed", () => {
    const n = 1000;
    console.log("start", n);
    for (let i = 0; i < n; i++) {
      interfaceId(abiERC721);
    }
    console.log("end", n, interfaceId(abiERC721));
  });
});
