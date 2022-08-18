import { expect } from "chai";

import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { getChainId, network, ethers, deployments } from "hardhat";

import type { OpenNFTsV4 } from "@soltypes/contracts/next";

import abiIOpenNFTsV4 from "@abis/contracts/interfaces/IOpenNFTsV4.sol/IOpenNFTsV4.json";

import abiIERC165 from "@abis/contracts/interfaces/IERC165.sol/IERC165.json";
import abiIERC2981 from "@abis/contracts/interfaces/IERC2981.sol/IERC2981.json";
import abiIERC721 from "@abis/contracts/interfaces/IERC721.sol/IERC721.json";
import abiIERC721Enumerable from "@abis/contracts/interfaces/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiIERC721Metadata from "@abis/contracts/interfaces/IERC721Metadata.sol/IERC721Metadata.json";

import { interfaceId } from "@lib/kconfig";

const { provider, getNamedSigner, getContract } = ethers;

let chainId: number;
let openNFTsV4: OpenNFTsV4;
let deployer: SignerWithAddress;
let tester1: SignerWithAddress;

describe("OpenNFTsV4", () => {
  before(async () => {
    chainId = Number(await getChainId());
    // console.log("network", chainId, network.name, network.live);

    deployer = await getNamedSigner("deployer");
    tester1 = await getNamedSigner("tester1");
  });

  beforeEach(async () => {
    await provider.send("hardhat_reset", []);

    if (chainId === 31337) await deployments.fixture(["OpenNFTsV4"]);

    openNFTsV4 = (await getContract("OpenNFTsV4", deployer)) as unknown as OpenNFTsV4;
  });

  describe("Setup", () => {
    beforeEach(async () => {});

    it("Should be deployed", () => {
      expect(deployer.address).to.be.properAddress;
      expect(tester1.address).to.be.properAddress;
      expect(openNFTsV4.address).to.be.properAddress;
    });

    it("Should support interfaces ", async function () {
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC165))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC2981))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC721))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC721Enumerable))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIERC721Metadata))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(abiIOpenNFTsV4))).to.be.true;
    });
  });
});
