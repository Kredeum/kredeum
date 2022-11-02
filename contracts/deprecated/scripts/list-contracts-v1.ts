import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";

import hre from "hardhat";
import { Contract } from "ethers";

import type { NFTsFactory } from "@soltypes/contracts";
import type { IERC721Enumerable, IERC721Metadata } from "@soltypes/OpenNFTs/contracts/interfaces/";
import abiINFTsFactory from "@abis/contracts/interfaces/INFTsFactory.sol/INFTsFactory.json";
import abiICloneFactory from "@abis/contracts/interfaces/ICloneFactory.sol/ICloneFactory.json";
import abiIERC165 from "@abis/OpenNFTs/contracts/interfaces/IERC165.sol/IERC165.json";
import abiIERC721 from "@abis/OpenNFTs/contracts/interfaces/IERC721.sol/IERC721.json";
import abiIERC721Metadata from "@abis/OpenNFTs/contracts/interfaces/IERC721Metadata.sol/IERC721Metadata.json";
import abiIERC721Enumerable from "@abis/OpenNFTs/contracts/interfaces/IERC721Enumerable.sol/IERC721Enumerable.json";

import { DEFAULT_NAME } from "@lib/common/kconfig";
import { collectionGet } from "@lib/collection/kcollection-get";
import networks from "@config/networks.json";

const abiNFT = abiIERC165.concat(abiIERC721).concat(abiIERC721Metadata).concat(abiIERC721Enumerable);

let totalChains = 0;
let totalCollections = 0;
let totalNFTs = 0;

const _s = (n: number): string => (n > 1 ? "s" : " ");

const logCollection = async (
  chainId: number,
  nftsFactory: NFTsFactory,
  max: number,
  signerOrProvider: Signer | Provider
) => {
  for (let index = 0; index < max; index++) {
    const collectionAddress = await nftsFactory.implementations(index);
    let output = collectionAddress;

    // bug sur XDAI
    if (collectionAddress === nftsFactory.address) {
      output += " is NFTsFactory";
    } else {
      const collectionObject = await collectionGet(chainId, collectionAddress, signerOrProvider);
      const collection = new Contract(collectionAddress, abiNFT, signerOrProvider);
      const { supports } = collectionObject;

      if (collection) {
        const nb = collection.totalSupply ? Number(await (collection as IERC721Enumerable).totalSupply()) : 0;

        const name = collection.name ? await (collection as IERC721Metadata).name() : DEFAULT_NAME;
        const symbol = collection.symbol ? await (collection as IERC721Metadata).symbol() : `NFT${_s(nb)}`;

        output += `${String(nb).padStart(8)} ${symbol.padEnd(5)} ${name.padEnd(32)}`;

        if (supports) {
          for (const [iface, supported] of Object.entries(supports)) {
            if (supported) output += ` ${iface}`;
          }
          if (supports.IOpenNFTsV2) {
            totalCollections++;
            totalNFTs += nb;
          }
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
        abiINFTsFactory.concat(abiICloneFactory),
        provider
      ) as NFTsFactory;
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
