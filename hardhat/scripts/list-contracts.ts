import type { Provider } from "@ethersproject/abstract-provider";
import type { NFTsFactory } from "types/NFTsFactory";

import INFTsFactory from "abis/deployed/INFTsFactory.json";
import IERC165 from "abis/erc/IERC165.json";
import IERC721 from "abis/erc/IERC721.json";
import IERC721Metadata from "abis/erc/IERC721Metadata.json";
import IERC721Enumerable from "abis/erc/IERC721Enumerable.json";

import { collectionGetContract, collectionGetSupportedInterfaces } from "../../common/lib/kcollection-get";

import networks from "config/networks.json";
import { ethers, changeNetwork } from "hardhat";

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
      const supports = await collectionGetSupportedInterfaces(chainId, collectionAddress, provider);

      if (collection) {
        const nb = collection.totalSupply ? Number(await collection.totalSupply()) : 0;

        const name = collection.name ? await collection.name() : "No name";
        const symbol = collection.symbol ? await collection.symbol() : `NFT${s(nb)}`;

        output += `${String(nb).padStart(8)} ${symbol.padEnd(5)} ${name.padEnd(32)}`;

        for (const [iface, supported] of Object.entries(supports)) {
          if (supported) output += ` ${iface}`;
        }
        if (supports.OpenNFTs) {
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

      changeNetwork(network.chainName);
      const provider = ethers.provider;

      const nftsFactory: NFTsFactory = new ethers.Contract(network.nftsFactory, INFTsFactory, provider) as NFTsFactory;
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
