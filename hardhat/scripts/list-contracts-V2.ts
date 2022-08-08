import type { Provider } from "@ethersproject/abstract-provider";
import hre from "hardhat";
import { Contract } from "ethers";

import type { NFTsFactoryV2 } from "soltypes/contracts";
import type { IERC721Enumerable } from "soltypes/contracts/interfaces";
import abiINFTsFactory from "abis/contracts/interfaces/INFTsFactory.sol/INFTsFactory.json";
import abiICloneFactory from "abis/contracts/interfaces/ICloneFactory.sol/ICloneFactory.json";
import abiIERC165 from "abis/contracts/interfaces/IERC165.sol/IERC165.json";
import abiIERC721 from "abis/contracts/interfaces/IERC721.sol/IERC721.json";
import abiIERC721Metadata from "abis/contracts/interfaces/IERC721Metadata.sol/IERC721Metadata.json";
import abiIERC721Enumerable from "abis/contracts/interfaces/IERC721Enumerable.sol/IERC721Enumerable.json";

import type { CollectionType } from "lib/ktypes";
import { collectionGet } from "lib/kcollection-get";
import networks from "config/networks.json";

const ABI_OPEN = "function open() view returns (bool)";
const INFT = abiIERC165.concat(abiIERC721).concat(abiIERC721Metadata).concat(abiIERC721Enumerable).concat(ABI_OPEN);

let totalChains = 0;
let totalCollections = 0;
let totalNFTs = 0;

const _s = (n: number): string => (n > 1 ? "s" : " ");

const logCollection = async (chainId: number, nftsFactory: NFTsFactoryV2, max: number, provider: Provider) => {
  for (let index = 0; index < max; index++) {
    const collectionAddress = await nftsFactory.implementations(index);
    let output = collectionAddress;
    // console.log("logCollection ~ collectionAddress", collectionAddress);

    // bug sur XDAI
    if (collectionAddress === nftsFactory.address) {
      output += " is NFTsFactoryV2";
    } else {
      const collectionObject: CollectionType = await collectionGet(chainId, collectionAddress, provider);
      const collection = new Contract(collectionAddress, INFT, provider) as IERC721Enumerable;
      const { supports, totalSupply, name, symbol } = collectionObject;
      // console.log("logCollection ~ collectionObject", collectionObject);

      if (collection) {
        output += `${String(totalSupply || 0).padStart(8)} ${(symbol || "").padEnd(5)} ${(name || "").padEnd(32)}`;

        if (supports) {
          if (
            supports.IOpenMulti ||
            supports.IOpenNFTsV3 ||
            supports.IOpenNFTsV2 ||
            supports.IOpenNFTsV1 ||
            supports.IOpenNFTsV0
          ) {
            output += " KREDEUM";
            totalCollections++;
            totalNFTs += totalSupply || 0;
          }
          for (const [iface, supported] of Object.entries(supports)) {
            if (supported) output += ` ${iface}`;
          }
        }
      }
    }
    console.log(output);
  }
};

const main = async (): Promise<void> => {
  const logNetworks = ["mainnet", "arbitrum", "optimism", "matic", "avalanche", "xdai", "fantom", "bsc"];

  for await (const network of networks.filter((nw) => logNetworks.includes(nw.chainName))) {
    if (network.mainnet && network.nftsFactoryV2) {
      totalChains++;

      // console.log(network);
      hre.changeNetwork(network.chainName);
      const provider = hre.ethers.provider;

      const nftsFactory: NFTsFactoryV2 = new hre.ethers.Contract(
        network.nftsFactoryV2,
        abiINFTsFactory.concat(abiICloneFactory),
        provider
      ) as NFTsFactoryV2;
      const nb = Number(await nftsFactory.implementationsCount());

      console.log(
        nftsFactory.address,
        `${String(nb).padStart(8)} Collection${_s(nb)} ${network.chainName.padStart(10)}`
      );

      await logCollection(network.chainId, nftsFactory, nb, provider);
      console.log();
    }
  }
  console.log(totalChains.toString(), "Chains");
  console.log(totalCollections.toString(), "Collections");
  console.log(totalNFTs.toString(), "NFTs");
};

main().catch(console.error);
