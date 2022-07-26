import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Signer } from "ethers";
import { interfaceId } from "lib/kconfig";

import type { OpenProof } from "soltypes/contracts/dev";

import abiERC165 from "abis/IERC165.sol/IERC165.json";
import abiERC173 from "abis/IERC173.sol/IERC173.json";
import abiERC721 from "abis/IERC721.sol/IERC721.json";
import abiERC721Enumerable from "abis/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiERC721Metadata from "abis/IERC721Metadata.sol/IERC721Metadata.json";
import abiERC721TokenReceiver from "abis/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";

import abiERC1155 from "abis/IERC1155.sol/IERC1155.json";
import abiERC4973 from "abis/IERC4973.sol/IERC4973.json";

describe("OpenProof", function () {
  let signer: Signer;
  let tester: Signer;
  let signerAddress: string;
  let testerAddress: string;
  let openProof: OpenProof;

  before(async () => {
    signer = await ethers.getNamedSigner("deployer");
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress, "\n");

    tester = await ethers.getNamedSigner("tester1");
    testerAddress = await tester.getAddress();

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull("OpenProof"))) {
      console.log("Deploy OpenProof...");
      await deployments.fixture(["OpenProof"]);
    }

    openProof = (await ethers.getContract("OpenProof", signer)) as unknown as OpenProof;
    console.log("openProof", openProof.address, "\n");
  });

  it("Should be ok", function () {
    expect(signerAddress).to.be.properAddress;
    expect(openProof.address).to.be.properAddress;
  });

  it("Should have correct interfaceIds", async () => {
    expect(await openProof.supportsInterface(interfaceId(abiERC165))).to.be.true;
    expect(await openProof.supportsInterface(interfaceId(abiERC721))).to.be.true;
    expect(await openProof.supportsInterface(interfaceId(abiERC721Enumerable))).to.be.true;
    expect(await openProof.supportsInterface(interfaceId(abiERC721Metadata))).to.be.true;
    expect(await openProof.supportsInterface(interfaceId(abiERC173))).to.be.true;
    expect(await openProof.supportsInterface(interfaceId(abiERC4973))).to.be.true;

    expect(await openProof.supportsInterface(interfaceId(abiERC721TokenReceiver))).to.be.false;
    expect(await openProof.supportsInterface(interfaceId(abiERC1155))).to.be.false;
  });

  it("Should be own by deployer", async () => {
    expect(await openProof.owner()).to.be.equal(signerAddress);
  });

  it("Should be able to mint a Proof", async () => {
    await expect(openProof.mintOpenProof(testerAddress, "https://ipfs.io/ipfs/1")).to.be.not.reverted;
  });

  it("Should not be able to transfer a Proof", async () => {
    await expect(openProof.connect(tester).transferFrom(testerAddress, signerAddress, 1)).to.be.revertedWith(
      "Non transferable NFT"
    );
    await expect(
      openProof.connect(tester)["safeTransferFrom(address,address,uint256)"](testerAddress, signerAddress, 1)
    ).to.be.revertedWith("Non transferable NFT");
  });
});
