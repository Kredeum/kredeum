import { expect } from "chai";

import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { getChainId, network, ethers, deployments } from "hardhat";
import { BigNumber, Wallet } from "ethers";

import type { OpenNFTsV4 } from "types/OpenNFTsV4";
import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IOpenNFTsV4 from "abis/IOpenNFTsV4.json";

import { interfaceId } from "lib/kconfig";

const { provider, getNamedSigner, getContract } = ethers;

let chainId: number;
let openNFTsV4: OpenNFTsV4;
let deployer: SignerWithAddress;
let tester1: SignerWithAddress;

describe.only("OpenNFTsV4", () => {
  before(async () => {
    chainId = Number(await getChainId());
    console.log("network", chainId, network.name, network.live);

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
      expect(await openNFTsV4.supportsInterface(interfaceId(IERC165))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(IERC721))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(IERC721Enumerable))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(IERC721Metadata))).to.be.true;
      expect(await openNFTsV4.supportsInterface(interfaceId(IOpenNFTsV4))).to.be.true;
    });
  });
});
