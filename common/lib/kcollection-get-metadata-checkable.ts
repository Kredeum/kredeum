import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionSupports } from "./ktypes";
import { interfaceId } from "./kconfig";

import { Contract } from "ethers";

import abiERC165 from "abis/IERC165.sol/IERC165.json";
import abiERC173 from "abis/IERC173.sol/IERC173.json";
import abiERC2981 from "abis/IERC2981.sol/IERC2981.json";
import abiERC721 from "abis/IERC721.sol/IERC721.json";
import abiERC721Enumerable from "abis/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiERC721Metadata from "abis/IERC721Metadata.sol/IERC721Metadata.json";
import abiERC721TokenReceiver from "abis/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";

import abiOpenCheckable from "abis/IOpenCheckable.sol/IOpenCheckable.json";
import abiOpenCloneable from "abis/IOpenCloneable.sol/IOpenCloneable.json";
import abiOpenMarketable from "abis/IOpenMarketable.sol/IOpenMarketable.json";
import abiOpenPauseable from "abis/IOpenPauseable.sol/IOpenPauseable.json";

import abiOpenNFTsV4 from "abis/IOpenNFTsV4.sol/IOpenNFTsV4.json";
import abiOpenBound from "abis/IOpenBound.sol/IOpenBound.json";

import type { IOpenCheckable } from "soltypes/contracts/interfaces/IOpenCheckable";
import type { IERC165 } from "soltypes/contracts/interfaces/IERC165";

const collectionGetSupportsCheckable = async (address: string, provider: Provider): Promise<CollectionSupports> => {
  // console.log("collectionGetSupportsCheckable", address);
  let supports: CollectionSupports = {};

  const checker = new Contract(address, abiERC165.concat(abiOpenCheckable), provider);
  const openCheckable = await (checker as IERC165).supportsInterface(interfaceId(abiOpenCheckable));

  if (openCheckable) {
    const ids = [
      interfaceId(abiERC165),
      interfaceId(abiERC173),
      interfaceId(abiERC2981),
      interfaceId(abiERC721),
      interfaceId(abiERC721Enumerable),
      interfaceId(abiERC721Metadata),
      interfaceId(abiERC721TokenReceiver),

      interfaceId(abiOpenNFTsV4),
      interfaceId(abiOpenBound),
      interfaceId(abiOpenCheckable),
      interfaceId(abiOpenCloneable),
      interfaceId(abiOpenMarketable),
      interfaceId(abiOpenPauseable),
      "0xffffffff"
    ];

    const checks = await (checker as IOpenCheckable).checkSupportedInterfaces(ids);

    let i = 0;
    supports = {
      IERC165: checks[i++],
      IERC173: checks[i++],
      IERC2981: checks[i++],
      IERC721: checks[i++],
      IERC721Enumerable: checks[i++],
      IERC721Metadata: checks[i++],
      IERC721TokenReceiver: checks[i++],

      IOpenNFTsV4: checks[i++],
      IOpenBound: checks[i++],
      IOpenCheckable: checks[i++],
      IOpenCloneable: checks[i++],
      IOpenMarketable: checks[i++],
      IOpenPauseable: checks[i++]
    };
    // assert IERC165 and IOpenCheckable to be always true and check 0xffffffff to be false
    if (!supports.IERC165 || !supports.IOpenCheckable || checks[i]) throw "ERROR checkSupportedInterfaces";
    // console.log("collectionGetSupportsCheckable", address, supports);
  }
  return supports;
};

export { collectionGetSupportsCheckable };
