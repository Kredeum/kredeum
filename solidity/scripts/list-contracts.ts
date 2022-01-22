import type { NFTsFactory } from "../types/NFTsFactory";
import type { IERC165 } from "../types/IERC165";
import type { IERC721Enumerable } from "../types/IERC721Enumerable";
import type { IERC721Metadata } from "../types/IERC721Metadata";
import type { Provider } from "@ethersproject/abstract-provider";

import { collectionGetSupportedInterfaces, collectionGet } from "../../lib/kcollection-get";

import hre from "hardhat";
import networks from "../../config/networks.json";

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

const s = (n: number): string => (n > 1 ? "s" : "");

const logCollection = async (chainId: number, nftsFactory: NFTsFactory, max: number, provider: Provider) => {
  for (let index = 0; index < max; index++) {
    const collectionAddress = await nftsFactory.implementations(index);
    let output = collectionAddress;

    const collection = new hre.ethers.Contract(collectionAddress, ABI_NFT, provider);
    // bug sur XDAI
    if (collection.address !== nftsFactory.address) {
      const nb = (await (collection as IERC165).supportsInterface("0x780e9d63"))
        ? Number(await (collection as IERC721Enumerable).totalSupply())
        : 0;

      let name: string;
      let symbol: string;
      if (await (collection as IERC165).supportsInterface("0x5b5e139f")) {
        name = await (collection as IERC721Metadata).name();
        symbol = await (collection as IERC721Metadata).symbol();
      }
      name = name || "No name";
      symbol = symbol || `NFT${s(nb)}`;
      const supports = (
        await collectionGetSupportedInterfaces(chainId, collectionGet(chainId, collectionAddress), provider)
      ).supports;

      output += `${String(nb).padStart(8)} ${symbol.padEnd(5)} ${name.padEnd(32)}`;
      Object.keys(supports).forEach((key) => {
        if (supports[key]) output += ` ${key}`;
      });
    } else {
      output += " not ERC721";
    }
    console.log(output);
  }
};
const main = async (): Promise<void> => {
  for await (const network of networks) {
    if (network.mainnet && network.nftsFactory) {
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
};

main().catch(console.error);
