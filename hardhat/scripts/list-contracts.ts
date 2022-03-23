import type { Provider } from "@ethersproject/abstract-provider";
import type { NFTsFactory } from "types/NFTsFactory";

import INFTsFactory from "abis/INFTsFactory.json";
import ICloneFactory from "abis/ICloneFactory.json";
import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";

import { collectionGetMetadata } from "lib/kcollection-get-metadata";
import { collectionGetContract } from "lib/kcollection-get";

import networks from "config/networks.json";
import hre from "hardhat";

const INFT = IERC165.concat(IERC721).concat(IERC721Metadata).concat(IERC721Enumerable);

let totalChains = 0;
let totalCollections = 0;
let totalNFTs = 0;

const s = (n: number): string => (n > 1 ? "s" : "");

const logCollection = async (chainId: number, nftsFactory: NFTsFactory, max: number, provider: Provider) => {
  for (let index = 0; index < max; index++) {
    const collectionAddress = await nftsFactory.implementations(index);
    let output = collectionAddress;

    // bug sur XDAI
    if (collectionAddress === nftsFactory.address) {
      output += " is NFTsFactory";
    } else {
      const collection = await collectionGetContract(chainId, collectionAddress, provider);
      const supports = await collectionGetMetadata(chainId, collectionAddress, provider);

      if (collection) {
        const nb = collection.totalSupply ? Number(await collection.totalSupply()) : 0;

        const name = collection.name ? await collection.name() : "No name";
        const symbol = collection.symbol ? await collection.symbol() : `NFT${s(nb)}`;

        output += `${String(nb).padStart(8)} ${symbol.padEnd(5)} ${name.padEnd(32)}`;

        for (const [iface, supported] of Object.entries(supports)) {
          if (supported) output += ` ${iface}`;
        }
        if (supports.IOpenNFTsV2) {
          totalCollections++;
          totalNFTs += nb;
        }
      }
    }
    console.log(output);
  }
};

const main = async (): Promise<void> => {
  for await (const network of networks) {
    if (network.mainnet && network.nftsFactory) {
      totalChains++;

      hre.changeNetwork(network.chainName);
      const provider = hre.ethers.provider;

      const nftsFactory: NFTsFactory = new hre.ethers.Contract(
        network.nftsFactory,
        INFTsFactory.concat(ICloneFactory),
        provider
      ) as NFTsFactory;
      const nb = Number(await nftsFactory.implementationsCount());

      console.log(
        nftsFactory.address,
        `${String(nb).padStart(8)} Collection${s(nb)} ${network.chainName.padStart(10)}`
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
