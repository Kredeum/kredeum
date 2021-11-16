import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import {
  listNFTs,
  listNFTsFromTheGraph,
  listNFTsFromContract,
  listNFTsFromCovalent
} from "../../lib/open-nfts";
import { getNetwork, Network } from "../../lib/kconfig";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

const txOptions = {
  maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
  type: 2
};
let contract: string;
let chainId: number;
let network: Network | undefined;

const artistAddress = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

describe.only("List NFTs lib", function () {
  beforeEach(async () => {
    chainId = (await ethers.provider.getNetwork()).chainId;
    network = getNetwork(chainId);

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    const openNFTs: OpenNFTs = await ethers.getContract("OpenNFTs");
    await ((await openNFTs.mintNFT(artistAddress, "", txOptions)) as TransactionResponse).wait();

    contract = openNFTs.address;

    console.log("totalSupply", (await openNFTs.totalSupply()).toNumber());
    // console.log(chainId, contract);
  });

  describe("Setup", function () {
    it("Should get OpenNFTs contract address", function () {
      expect(contract).to.be.properAddress;
    });
  });

  describe("List NFTs", function () {
    this.timeout(50000);

    it("With SmartContract", async function () {
      expect(
        (await listNFTsFromContract(chainId, contract, artistAddress, 9, ethers.provider)).length
      ).to.be.gte(1);
    });

    it("With default method", async function () {
      expect(
        (await listNFTs(chainId, contract, artistAddress, 9, ethers.provider)).length
      ).to.be.gte(1);
    });

    it("With TheGraph", async function () {
      if (network?.subgraph) {
        expect((await listNFTsFromTheGraph(chainId, contract)).length).to.be.gte(1);
      }
    });

    it("With Covalent", async function () {
      if (network?.covalent) {
        expect((await listNFTsFromCovalent(chainId, contract)).length).to.be.gte(1);
      }
    });
  });
});
