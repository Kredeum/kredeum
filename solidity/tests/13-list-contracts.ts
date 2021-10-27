import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { BigNumber } from "ethers";
import {
  listCollections,
  listCollectionsFromCovalent,
  listCollectionsFromTheGraph,
  listCollectionsFromFactory
} from "../../lib/nfts-factory";
import type { NFTsFactory } from "../../lib/nfts-factory";

import { getNetwork, Network } from "../../lib/kconfig";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("List contracts lib", async function () {
  let chainId: number;
  let owner: string;
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  let network: Network;
  let nftsFactory: NFTsFactory;

  beforeEach(async () => {
    const signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    chainId = (await ethers.provider.getNetwork()).chainId;
    network = getNetwork(chainId);
    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs", "NFTsFactory"]);
    }

    const openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;
    await (await openNFTs.mintNFT(artist, "", txOptions)).wait();

    nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;

    const openNFTsFactory = await ethers.getContractFactory("OpenNFTs");
    const newOpenNFTs = await openNFTsFactory.deploy();
    await (await newOpenNFTs.mintNFT(artist, "", txOptions)).wait();

    await (await nftsFactory.setDefaultTemplate(newOpenNFTs.address, txOptions)).wait();
  });

  it("Should clone", async function () {
    const txOptions = {
      value: ethers.utils.parseEther("2"),
      maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      type: 2
    };

    await (await nftsFactory.clone("Open NFTs 1", "NFT1", txOptions)).wait();
    await (await nftsFactory.clone("Open NFTs 2", "NFT2", txOptions)).wait();
  });

  it("List with NFTsFactory", async function () {
    console.log((await nftsFactory.implementationsCount()).toString());
    console.log(await nftsFactory.balancesOf(owner));
    console.log(await listCollectionsFromFactory(chainId, owner, ethers.provider));
    // expect((await listCollectionsFromFactory(chainId, owner, ethers.provider)).size).to.be.gte(1);
  });

  it("List with default method", async function () {
    expect((await listCollections(chainId, artist, ethers.provider)).length).to.be.gte(1);
  });

  it("List with The Graph", async function () {
    if (network.subgraph) {
      expect((await listCollectionsFromTheGraph(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (network.covalent) {
      expect((await listCollectionsFromCovalent(chainId, artist)).size).to.be.gte(1);
    }
  });
});
