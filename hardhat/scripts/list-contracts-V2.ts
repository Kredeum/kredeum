import type { Provider } from "@ethersproject/abstract-provider";
import hre from "hardhat";
import { Contract } from "ethers";

import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { ERC721Enumerable } from "types/ERC721Enumerable";
import INFTsFactory from "abis/INFTsFactory.json";
import ICloneFactory from "abis/ICloneFactory.json";
import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";

import type { CollectionType } from "lib/ktypes";
import { collectionGet } from "lib/kcollection-get";
import networks from "config/networks.json";

const ABI_OPEN = "function open() view returns (bool)";
const INFT = IERC165.concat(IERC721).concat(IERC721Metadata).concat(IERC721Enumerable).concat(ABI_OPEN);

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
      const collection = new Contract(collectionAddress, INFT, provider) as ERC721Enumerable;
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
        INFTsFactory.concat(ICloneFactory),
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
