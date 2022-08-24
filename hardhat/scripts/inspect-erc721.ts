import type { OpenNFTs } from "./types/OpenNFTs";
import type { AbiType } from "../../common/lib/ktypes";

import { ethers, network, getChainId } from "hardhat";
import abis from "../../common/lib/abis.json";
import { collectionGetContract } from "../../common/lib/kcollection-get";

const collectionAddress = "0xd07dc4262BCDbf85190C01c996b4C06a461d2430";
const owner = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";
const supported = new Map();

const main = async (): Promise<boolean> => {
  const signer = await ethers.getNamedSigner("deployer");
  const chainId = Number(await getChainId());

  console.log("network", network.name, chainId);

  const { contract, supports } = await collectionGetContract(chainId, collectionAddress, signer);

  if (collection) {
    console.log(collection.functions);

    for await (const key of Object.keys(abis)) {
      const abi = abis[key] as AbiType;
      if (abi.interfaceId && (await collection.supportsInterface(abi.interfaceId))) {
        supported.set(key, true);
        console.log(key, "supported");
      }
    }

    if (supported.get("ERC721")) {
      console.error("ERC721");

      const balanceOf = Number(await collection.balanceOf(owner));
      console.log("balanceOf", balanceOf.toString());

      for (let index = 0; index < balanceOf; index++) {
        const tokenId = await collection.tokenOfOwnerByIndex(owner, index);
        console.log("tokenId", index, "=", tokenId.toString());
      }
    }
    if (supported.get("ERC1155")) {
      console.error("ERC1155");

      const balanceOf = Number(await collection.balanceOf(owner));
      console.log("balanceOf", balanceOf.toString());
    }
  } else {
    console.error("Collection not found", chainId, collectionAddress);
  }

  return true;
};

main().then(console.log).catch(console.error);
