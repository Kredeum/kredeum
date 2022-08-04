import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionSupports } from "./ktypes";
import { interfaceId } from "./kconfig";

import { Contract } from "ethers";

import { abis } from "lib/kabis";

import type { IOpenChecker } from "soltypes/OpenNFTs/contracts/interfaces/IOpenChecker";
import type { IERC165 } from "soltypes/contracts/interfaces/IERC165";

const collectionGetSupportsChecker = async (address: string, provider: Provider): Promise<CollectionSupports> => {
  // console.log("collectionGetSupportsChecker", address);
  let supports: CollectionSupports = {};

  const checker = new Contract(address, abis["IERC165"].concat(abis["IOpenChecker"]), provider);
  const openChecker = await (checker as IERC165).supportsInterface(interfaceId(abis["IOpenChecker"]));

  if (openChecker) {
    const ids = [
      interfaceId(abis["IERC165"]),
      interfaceId(abis["IERC173"]),
      interfaceId(abis["IERC2981"]),
      interfaceId(abis["IERC721"]),
      interfaceId(abis["IERC721Enumerable"]),
      interfaceId(abis["IERC721Metadata"]),
      interfaceId(abis["IERC721TokenReceiver"]),

      interfaceId(abis["IOpenNFTsV4"]),
      interfaceId(abis["IOpenBound"]),
      interfaceId(abis["IOpenChecker"]),
      interfaceId(abis["IOpenCloneable"]),
      interfaceId(abis["IOpenMarketable"]),
      interfaceId(abis["IOpenPauseable"]),
      "0xffffffff"
    ];

    const checks = await (checker as IOpenChecker).checkSupportedInterfaces(ids);

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
      IOpenChecker: checks[i++],
      IOpenCloneable: checks[i++],
      IOpenMarketable: checks[i++],
      IOpenPauseable: checks[i++]
    };
    // assert IERC165 and IOpenChecker to be always true and check 0xffffffff to be false
    if (!supports.IERC165 || !supports.IOpenChecker || checks[i]) throw "ERROR checkSupportedInterfaces";
    // console.log("collectionGetSupportsChecker", address, supports);
  }
  return supports;
};

export { collectionGetSupportsChecker };
