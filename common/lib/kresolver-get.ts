import type { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "ethers";

import type { CollectionSupports } from "@lib/ktypes";
import { interfaceId } from "@lib/kconfig";
import { abis } from "@lib/kabis";
import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { IOpenChecker } from "@soltypes/OpenNFTs/contracts/interfaces/IOpenChecker";
import type { NFTsResolver } from "@soltypes/contracts/next";
import abiNFTsResolver from "@abis/contracts/next/NFTsResolver.sol/NFTsResolver.json";

// Cache nftsResolver(chainId)
const _nftsResolversCache: Map<number, Contract> = new Map();

//  GET nftsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET nftsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, resolverGetAddress(chainId));

// GET NFTsResolver Contract
const resolverGetContract = (chainId: number, provider: Provider): NFTsResolver => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = _nftsResolversCache.get(chainId);
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiNFTsResolver, provider);
    _nftsResolversCache.set(chainId, nftsResolver);
  }

  // console.log("nftsResolver", nftsResolver);
  return nftsResolver as NFTsResolver;
};

const resolverGetCollectionInfos = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<CollectionInfos> => {};

const resolverGetCollectionSupports = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<CollectionSupports> => {
  // console.log("collectionGetSupports", address);
  let supports: CollectionSupports = {};

  const nftsResolver = resolverGetContract(chainId, provider);
  if (nftsResolver) {
    /// 0xffffffff :  O Invalid
    /// 0x01ffc9a7 :  1 ERC165
    ///
    /// 0x80ac58cd :  2 ERC721
    /// 0x5b5e139f :  3 ERC721Metadata
    /// 0x780e9d63 :  4 ERC721Enumerable
    /// 0x150b7a02 :  5 ERC721TokenReceiver
    ///
    /// 0xd9b67a26 :  6 ERC1155
    /// 0x0e89341c :  7 ERC1155MetadataURI
    /// 0x4e2312e0 :  8 ERC1155TokenReceiver
    ///
    /// 0x7f5828d0 :  9 ERC173
    /// 0x2a55205a : 10 ERC2981
    const ids = [
      "0xffffffff",
      "0x01ffc9a7",

      "0x80ac58cd",
      "0x5b5e139f",
      "0x780e9d63",
      "0x150b7a02",

      "0xd9b67a26",
      "0x0e89341c",
      "0x4e2312e0",

      "0x7f5828d0",
      "0x2a55205a",

      interfaceId(abis["IOpenNFTsV0"]),
      interfaceId(abis["IOpenNFTsV1"]),
      interfaceId(abis["IOpenNFTsV2"]),
      interfaceId(abis["IOpenNFTsV3"]),
      interfaceId(abis["IOpenNFTsV4"]),
      interfaceId(abis["IOpenBound"]),

      interfaceId(abis["ICloneFactory"]),
      interfaceId(abis["INFTsFactory"]),
      interfaceId(abis["ICloneFactoryV2"]),
      interfaceId(abis["INFTsFactoryV2"]),

      interfaceId(abis["IOpenChecker"]),
      interfaceId(abis["IOpenCloneable"]),
      interfaceId(abis["IOpenMarketable"]),
      interfaceId(abis["IOpenPauseable"])
    ];
    // console.log("collectionGetSupports ~ ids", ids);

    const checks = await (nftsResolver as IOpenChecker).checkSupportedInterfaces(address, ids);

    let i = 1;
    supports = {
      IERC165: checks[i++],

      IERC721: checks[i++],
      IERC721Enumerable: checks[i++],
      IERC721Metadata: checks[i++],
      IERC721TokenReceiver: checks[i++],

      IERC1155: checks[i++],
      IERC1155MetadataURI: checks[i++],
      IERC1155TokenReceiver: checks[i++],

      IERC173: checks[i++],
      IERC2981: checks[i++],

      IOpenNFTsV0: checks[i++],
      IOpenNFTsV1: checks[i++],
      IOpenNFTsV2: checks[i++],
      IOpenNFTsV3: checks[i++],
      IOpenNFTsV4: checks[i++],
      IOpenBound: checks[i++],

      ICloneFactory: checks[i++],
      INFTsFactory: checks[i++],
      ICloneFactoryV2: checks[i++],
      INFTsFactoryV2: checks[i++],

      IOpenChecker: checks[i++],
      IOpenCloneable: checks[i++],
      IOpenMarketable: checks[i++],
      IOpenPauseable: checks[i++]
    };
    // console.log("collectionGetSupports", address, supports);
    // assert IERC165 to be always true and check 0xffffffff to be false
    if (!supports.IERC165 || checks[0]) throw "ERROR checkSupportedInterfaces";
  }
  return supports;
};

export {
  resolverGetCollectionInfos,
  resolverGetCollectionSupports,
  resolverGetAddress,
  resolverGetContract,
  resolverGetExplorerUrl
};
