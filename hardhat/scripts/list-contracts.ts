import type { NFTsFactory } from "../types/NFTsFactory";
import type { IERC165 } from "../types/IERC165";
import type { IERC721Enumerable } from "../types/IERC721Enumerable";
import type { IERC721Metadata } from "../types/IERC721Metadata";
import type { Provider } from "@ethersproject/abstract-provider";

import { collectionGetContract, collectionGetSupportedInterfaces } from "../../common/lib/kcollection-get";

import networks from "../../common/config/networks.json";
import hre from "hardhat";

const ABI_FACTORY = [
  "function implementations(uint256 index) external view returns (address implementation)",
  "function implementationsCount() external view returns (uint256 count)"
];
const ABI_NFT = [
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

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

      const nb = collection.totalSupply ? Number(await collection.totalSupply()) : 0;

      const name = collection.name ? await collection.name() : "No name";
      const symbol = collection.symbol ? await collection.symbol() : `NFT${s(nb)}`;

      output += `${String(nb).padStart(8)} ${symbol.padEnd(5)} ${name.padEnd(32)}`;
      Object.keys(supports).forEach((key) => {
        if (supports[key]) output += ` ${key}`;
      });
      if (supports.OpenNFTs) {
        totalCollections++;
        totalNFTs += nb;
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
        ABI_FACTORY,
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
