import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";
import { interfaceId } from "./kconfig";

import { Contract } from "ethers";

import { abis } from "lib/kabis";

import type { IERC165 } from "soltypes/contracts/interfaces/IERC165";

const openNFTsV0Addresses = [
  "0xF6d53C7e96696391Bb8e73bE75629B37439938AF", // matic
  "0x792f8e3C36Ac3c1C6D62ECc44a88cA1317fEce93" // matic
];
const openNFTsV1Addresses = [
  "0x82a398243EBc2CB26a4A21B9427EC6Db8c224471", // mainnet
  "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253", // matic
  "0xC9D75c6dC5A75315ff68A4CB6fba5c53aBed82d0", // matic
  "0xd9C43494D2b3B5Ae86C57d12eB7683956472d5E9" // Bsc
];

const collectionGetSupportsOld = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<CollectionSupports> => {
  let supports: CollectionSupports = {};

  const contract = new Contract(address, abis["IERC165"], provider) as IERC165;
  supports = { IERC165: true };

  const waitERC721 = contract.supportsInterface(interfaceId(abis["IERC721"]));
  const waitERC1155 = contract.supportsInterface(interfaceId(abis["IERC1155"]));
  const waitERC173 = contract.supportsInterface(interfaceId(abis["IERC173"]));
  [supports.IERC721, supports.IERC1155, supports.IERC173] = await Promise.all([waitERC721, waitERC1155, waitERC173]);

  if (supports.IERC721) {
    const waitMetadata = contract.supportsInterface(interfaceId(abis["IERC721Metadata"]));
    const waitEnumerable = contract.supportsInterface(interfaceId(abis["IERC721Enumerable"]));
    const waitOpenNFTsV2 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV2"]));
    const waitOpenNFTsV3 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV3"]));
    const waitOpenNFTsV4 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV4"]));

    [
      supports.IERC721Metadata,
      supports.IERC721Enumerable,
      supports.IOpenNFTsV2,
      supports.IOpenNFTsV3,
      supports.IOpenNFTsV4
    ] = await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3, waitOpenNFTsV4]);

    // Supports ERC165,  should have already reverted otherwise

    if (!supports.IOpenNFTsV2) {
      if (openNFTsV1Addresses.includes(contract.address)) {
        supports.IOpenNFTsV1 = true;
      } else if (openNFTsV0Addresses.includes(contract.address)) {
        supports.IOpenNFTsV0 = true;
      }
    }
  } else if (supports.IERC1155) {
    supports.IERC1155MetadataURI = await contract.supportsInterface(interfaceId(abis["IERC1155MetadataURI"]));
  }

  for (const key in supports) {
    if (!supports[key as ABIS]) delete supports[key as ABIS];
  }

  // console.log(`collectionGetSupports OUT ${collectionKey(chainId, address)}\n`, supports);

  return supports;
};

export { collectionGetSupportsOld };
