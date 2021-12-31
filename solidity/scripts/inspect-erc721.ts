import type { OpenNFTs } from "solidity/types/OpenNFTs";

import { ethers, network, getChainId } from "hardhat";
import { expect } from "chai";
import abis from "../../lib/abis.json";

const openNFTsAddress = "0xE5EaCc6F36881A68961d3Af46fcF6a7A1E02160F";
const openNFTsAbi = abis.ERC165.abi
  .concat(abis.ERC721.abi)
  .concat(abis.ERC721Enumerable.abi)
  .concat(abis.OpenNFTsV2.abi);
const owner = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";

const main = async (): Promise<boolean> => {
  const signer = await ethers.getNamedSigner("deployer");

  console.log("network", network.name, await getChainId());
  const openNFTs: OpenNFTs = await ethers.getContractAt(openNFTsAbi, openNFTsAddress, signer);

  // what version ?
  console.log("V0", await openNFTs.supportsInterface(abis.OpenNFTsV0.interfaceId));
  console.log("V1", await openNFTs.supportsInterface(abis.OpenNFTsV1.interfaceId));
  console.log("V2", await openNFTs.supportsInterface(abis.OpenNFTsV2.interfaceId));
  console.log("V3", await openNFTs.supportsInterface(abis.OpenNFTsV3.interfaceId));

  expect(openNFTs.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  const balanceOf = Number(await openNFTs.balanceOf(owner));
  console.log("balanceOf", balanceOf.toString());

  for (let index = 0; index < balanceOf; index++) {
    const tokenId = await openNFTs.tokenOfOwnerByIndex(owner, index);
    console.log("tokenId", index, "=", tokenId.toString());
  }

  return true;
};

main().then(console.log).catch(console.error);
