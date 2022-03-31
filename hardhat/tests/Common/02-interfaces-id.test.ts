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
import { keyIn } from "readline-sync";

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
    const interfaces = {
      IERC165: IERC165,
      IERC721: IERC721,
      IERC721TokenReceiver: IERC721TokenReceiver,
      IERC721Metadata: IERC721Metadata,
      IERC721Enumerable: IERC721Enumerable,
      IERC1155: IERC1155,
      IERC1155TokenReceiver: IERC1155TokenReceiver,
      IERC1155MetadataURI: IERC1155MetadataURI,
      IERC173: IERC173,
      IOpenNFTs: IOpenNFTs,
      IOpenNFTsV0: IOpenNFTsV0,
      IOpenNFTsV1: IOpenNFTsV1,
      IOpenNFTsV2: IOpenNFTsV2,
      IOpenNFTsV3: IOpenNFTsV3,
      ICloneFactory: ICloneFactory,
      INFTsFactory: INFTsFactory,
      ICloneFactoryV2: ICloneFactoryV2,
      INFTsFactoryV2: INFTsFactoryV2
    };

    let i = 0;
    for (const [key, value] of Object.entries(interfaces)) {
      expect(ids[i]).to.be.equal(interfaceId(value));
      console.log(ids[i], key);
      i++;
    }
  });

  it("Should test interfaceId speed", () => {
    const n = 1000;
    console.log("start", n);
    for (let i = 0; i < n; i++) {
      interfaceId(IERC721);
    }
    console.log("end", n, interfaceId(IERC721));
  });
});
