import { expect } from "chai";
import { ethers, deployments, network } from "hardhat";
import {
  listContracts,
  listContractsFromCovalent,
  listContractsFromTheGraph,
  listContractsFromFactory
} from "../../lib/nfts-factory";
import { getNetwork, Network } from "../../lib/kconfig";

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

  beforeEach(async () => {
    chainId = (await ethers.provider.getNetwork()).chainId;
    network = getNetwork(chainId);

    const signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    const openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;
    if (chainId === 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }
    const nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;
    console.log("nftsFactory.address", nftsFactory.address);
    await (await nftsFactory.addTemplate(openNFTs.address, txOptions)).wait();
    await (await openNFTs.mintNFT(artist, "", txOptions)).wait();

    const newOpenNFTs = await ethers.getContractFactory("OpenNFTs");
    const implementation = await newOpenNFTs.deploy();
    await (await nftsFactory.addTemplate(implementation.address, txOptions)).wait();
  });

  it("List with NFTsFactory", async function () {
    expect((await listContractsFromFactory(chainId, artist, ethers.provider)).size).to.be.gt(1);
  });

  it("List with default method", async function () {
    expect((await listContracts(chainId, artist, ethers.provider)).length).to.be.gt(1);
  });

  it("List with The Graph", async function () {
    if (network.subgraph) {
      expect((await listContractsFromTheGraph(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (network.covalent) {
      expect((await listContractsFromCovalent(chainId, artist)).size).to.be.gte(1);
    }
  });
});
