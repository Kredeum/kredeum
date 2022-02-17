import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "types/OpenNFTs";
import type { NFTsFactory } from "types/NFTsFactory";
import type { Network } from "lib/ktypes";

import {
  collectionList,
  collectionListFromCovalent,
  collectionListFromTheGraph,
  collectionListFromFactory
} from "lib/kcollection-list";
import { expect } from "chai";
import { getNetwork } from "lib/kconfig";
import hre from "hardhat";
import { Signer } from "ethers";
const { ethers, deployments } = hre;

describe("13 List contracts lib", function () {
  let owner: string;
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  let configNetwork: Network | undefined;
  let nftsFactory: NFTsFactory;

  let network: string;
  let chainId: number;
  let live: boolean;
  let signer: Signer;

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    owner = await signer.getAddress();

    network = hre.network.name;
    chainId = Number(await hre.getChainId());
    live = hre.network.live;
    console.log("network", network, chainId, live);
  });

  beforeEach(async () => {
    configNetwork = getNetwork(chainId);
    if (chainId === 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }

    const openNFTs: OpenNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;
    await ((await openNFTs.mintNFT(artist, "", txOptions)) as TransactionResponse).wait();

    nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await (await nftsFactory.setDefaultTemplate(openNFTs.address, txOptions)).wait();
  });

  it("Should clone", async function () {
    await (await nftsFactory.clone("Open NFTs 1", "NFT1")).wait();
    await (await nftsFactory.clone("Open NFTs 2", "NFT2")).wait();
  });

  it("List with NFTsFactory", async function () {
    if (chainId !== 31337) {
      console.log((await nftsFactory.implementationsCount()).toString());
      console.log(await nftsFactory.balancesOf(owner));
      console.log(await collectionListFromFactory(chainId, owner, ethers.provider));
      expect((await collectionListFromFactory(chainId, owner, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with default method", async function () {
    if (chainId !== 31337) {
      expect((await collectionList(chainId, artist, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with The Graph", async function () {
    if (configNetwork?.subgraph) {
      expect((await collectionListFromTheGraph(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (configNetwork?.covalent) {
      expect((await collectionListFromCovalent(chainId, artist)).size).to.be.gte(1);
    }
  });
});
