import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTsV4, OpenNFTsFactoryV3 } from "@soltypes/contracts";

import type { NetworkType } from "@lib/common/types";

import { collectionList } from "@lib/collection/collection-list";
import { resolverGetCollections } from "@lib/resolver/resolver-get-collection";
import { covalentCollections } from "@lib/apis/api-covalent";
import { thegraphCollections } from "@lib/apis/api-thegraph";

thegraphCollections;

import { expect } from "chai";
import { getNetwork } from "@lib/common/config";
import hre from "hardhat";
import { Signer } from "ethers";
const { ethers, deployments } = hre;

describe.skip("13 List contracts lib", function () {
  let owner: string;
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  let configNetwork: NetworkType | undefined;
  let nftsFactory: OpenNFTsFactoryV3;
  let openNFTsV4: OpenNFTsV4;

  let network: string;
  let chainId: number;
  let live: boolean;
  let signer: Signer;

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    owner = await signer.getAddress();

    // network = hre.network.name;
    // live = hre.network.live;
    chainId = Number(await hre.getChainId());
    // console.log("network", network, chainId, live);
  });

  beforeEach(async () => {
    configNetwork = getNetwork(chainId);
    const { deployer } = await ethers.getNamedSigners();

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV4", "OpenNFTsFactoryV3"]);
    }

    openNFTsV4 = (await ethers.getContract("OpenNFTsV4", signer)) as unknown as OpenNFTsV4;
    expect(openNFTsV4.address).to.be.properAddress;
    // TODO await ((await openNFTsV4.mint(artist, "", txOptions)) as TransactionResponse).wait();

    nftsFactory = (await ethers.getContract("OpenNFTsFactoryV3", signer)) as unknown as OpenNFTsFactoryV3;
    expect(nftsFactory.address).to.be.properAddress;

    await nftsFactory.connect(deployer).setTemplate("generic", openNFTsV4.address);
  });

  it("List with OpenNFTsFactoryV3", async function () {
    if (chainId !== 31337) {
      // console.log((await nftsFactory.implementationsCount()).toString());
      // console.log(await nftsFactory.balancesOf(owner));
      // console.log(await collectionListFromFactory(chainId, owner, ethers.provider));
      expect((await resolverGetCollections(chainId, ethers.provider, owner)).size).to.be.gte(1);
    }
  });

  it("List with default method", async function () {
    if (chainId !== 31337) {
      expect((await collectionList(chainId, ethers.provider, artist)).size).to.be.gte(1);
    }
  });

  it("List with The Graph", async function () {
    if (configNetwork?.subgraph) {
      expect((await thegraphCollections(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (configNetwork?.covalent) {
      expect((await covalentCollections(chainId, artist)).size).to.be.gte(1);
    }
  });
});
