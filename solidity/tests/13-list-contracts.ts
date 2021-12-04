import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";
import type { NFTsFactory } from "../artifacts/types/NFTsFactory";
import type { Network } from "../../lib/ktypes";

import {
  listCollections,
  listCollectionsFromCovalent,
  listCollectionsFromTheGraph,
  listCollectionsFromFactory
} from "../../lib/klist-collections";
import { expect } from "chai";
import { getNetwork } from "../../lib/kconfig";
import hre from "hardhat";
import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
const { ethers, deployments } = hre;

describe("List contracts lib", function () {
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
  let signer: SignerWithAddress;

  before(async () => {
    signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

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

    const openNFTsFactory = await ethers.getContractFactory("OpenNFTs");
    const newOpenNFTs: OpenNFTs = (await openNFTsFactory.deploy()) as OpenNFTs;
    await ((await newOpenNFTs.mintNFT(artist, "", txOptions)) as TransactionResponse).wait();

    await (await nftsFactory.setDefaultTemplate(newOpenNFTs.address, txOptions)).wait();
  });

  it("Should clone", async function () {
    const txOptions = {
      maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      type: 2
    };

    await (await nftsFactory.clone("Open NFTs 1", "NFT1", txOptions)).wait();
    await (await nftsFactory.clone("Open NFTs 2", "NFT2", txOptions)).wait();
  });

  it("List with NFTsFactory", async function () {
    if (chainId !== 31337) {
      console.log((await nftsFactory.implementationsCount()).toString());
      console.log(await nftsFactory.balancesOf(owner));
      console.log(await listCollectionsFromFactory(chainId, owner, ethers.provider));
      expect((await listCollectionsFromFactory(chainId, owner, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with default method", async function () {
    if (chainId !== 31337) {
      expect((await listCollections(chainId, artist, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with The Graph", async function () {
    if (configNetwork?.subgraph) {
      expect((await listCollectionsFromTheGraph(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (configNetwork?.covalent) {
      expect((await listCollectionsFromCovalent(chainId, artist)).size).to.be.gte(1);
    }
  });
});
