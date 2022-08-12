import type { CollectionSupports } from "./ktypes";

import { Provider } from "@ethersproject/abstract-provider";
import { interfaceId } from "./kconfig";
import { resolverGetContract } from "./kresolver-get";

import { abis } from "lib/kabis";

import type { IOpenChecker } from "soltypes/OpenNFTs/contracts/interfaces/IOpenChecker";

const collectionGetSupportsChecker = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<CollectionSupports> => {
  // console.log("collectionGetSupportsChecker", address);
  let supports: CollectionSupports = {};

  const nftsResolver = resolverGetContract(chainId, provider);
  if (nftsResolver) {
    const ids = [
      interfaceId(abis["IERC165"]),
      interfaceId(abis["IERC173"]),

      interfaceId(abis["IERC721"]),
      interfaceId(abis["IERC721Enumerable"]),
      interfaceId(abis["IERC721Metadata"]),
      interfaceId(abis["IERC721TokenReceiver"]),

      interfaceId(abis["IERC1155"]),
      interfaceId(abis["IERC1155MetadataURI"]),
      interfaceId(abis["IERC1155TokenReceiver"]),

      interfaceId(abis["IERC2981"]),

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
      interfaceId(abis["IOpenPauseable"]),

      "0xffffffff"
    ];
    // console.log("collectionGetSupportsChecker ~ ids", ids);

    const checks = await (nftsResolver as IOpenChecker)["checkSupportedInterfaces(address,bytes4[])"](address, ids);

    let i = 0;
    supports = {
      IERC165: checks[i++],
      IERC173: checks[i++],

      IERC721: checks[i++],
      IERC721Enumerable: checks[i++],
      IERC721Metadata: checks[i++],
      IERC721TokenReceiver: checks[i++],

      IERC1155: checks[i++],
      IERC1155MetadataURI: checks[i++],
      IERC1155TokenReceiver: checks[i++],

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
    // console.log("collectionGetSupportsChecker", address, supports);
    // assert IERC165 to be always true and check 0xffffffff to be false
    if (!supports.IERC165 || checks[i]) throw "ERROR checkSupportedInterfaces";
  }
  return supports;
};

export { collectionGetSupportsChecker };
