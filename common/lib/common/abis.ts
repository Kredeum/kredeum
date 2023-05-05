import abiIERC165 from "@abis/IERC165.sol/IERC165.json";

import abiIERC721 from "@abis/IERC721.sol/IERC721.json";
import abiIERC721Enumerable from "@abis/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiIERC721Metadata from "@abis/IERC721Metadata.sol/IERC721Metadata.json";
import abiIERC721TokenReceiver from "@abis/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";
// import abiIERC721Events from "@abis/IERC721Events.sol/IERC721Events.json";
// import abiIERCNftInfos from "@abis/IERCNftInfos.sol/IERCNftInfos.json";

import abiIERC1155 from "@abis/IERC1155.sol/IERC1155.json";
import abiIERC1155MetadataURI from "@abis/IERC1155MetadataURI.sol/IERC1155MetadataURI.json";
import abiIERC1155TokenReceiver from "@abis/IERC1155TokenReceiver.sol/IERC1155TokenReceiver.json";

// import abiIERC20 from "@abis/IERC20.sol/IERC20.json";
import abiIERC173 from "@abis/IERC173.sol/IERC173.json";
import abiIERC2981 from "@abis/IERC2981.sol/IERC2981.json";

import abiIOpenNFTs from "@abis/IOpenNFTs.sol/IOpenNFTs.json";
import abiIOpenChecker from "@abis/IOpenChecker.sol/IOpenChecker.json";
import abiIOpenCloneable from "@abis/IOpenCloneable.sol/IOpenCloneable.json";
import abiIOpenMarketable from "@abis/IOpenMarketable.sol/IOpenMarketable.json";
import abiIOpenPauseable from "@abis/IOpenPauseable.sol/IOpenPauseable.json";

import abiIOpenNFTsV0 from "@abis/IOpenNFTsV0.sol/IOpenNFTsV0.json";
import abiIOpenNFTsV1 from "@abis/IOpenNFTsV1.sol/IOpenNFTsV1.json";
import abiIOpenNFTsV2 from "@abis/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiIOpenNFTsV3 from "@abis/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import abiIOpenNFTsV4 from "@abis/IOpenNFTsV4.sol/IOpenNFTsV4.json";
import abiIOpenAutoMarket from "@abis/IOpenAutoMarket.sol/IOpenAutoMarket.json";
import abiIOpenBound from "@abis/IOpenBound.sol/IOpenBound.json";

import abiICloneFactoryV2 from "@abis/ICloneFactoryV2.sol/ICloneFactoryV2.json";
import abiINFTsFactoryV2 from "@abis/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import abiIOpenNFTsFactoryV3 from "@abis/IOpenNFTsFactoryV3.sol/IOpenNFTsFactoryV3.json";

import abiIOpenNFTsOld from "@abis/IOpenNFTsOld.sol/IOpenNFTsOld.json";
import abiIOpenNFTsV3Plus from "@abis/IOpenNFTsV3Plus.sol/IOpenNFTsV3Plus.json";

const abisObject = {
  IERC165: abiIERC165,

  IERC721: abiIERC721,
  IERC721Enumerable: abiIERC721Enumerable,
  IERC721Metadata: abiIERC721Metadata,
  IERC721TokenReceiver: abiIERC721TokenReceiver,

  IERC1155: abiIERC1155,
  IERC1155MetadataURI: abiIERC1155MetadataURI,
  IERC1155TokenReceiver: abiIERC1155TokenReceiver,

  IERC173: abiIERC173,
  IERC2981: abiIERC2981,

  IOpenNFTs: abiIOpenNFTs,
  IOpenChecker: abiIOpenChecker,
  IOpenCloneable: abiIOpenCloneable,
  IOpenMarketable: abiIOpenMarketable,
  IOpenPauseable: abiIOpenPauseable,

  IOpenNFTsV0: abiIOpenNFTsV0,
  IOpenNFTsV1: abiIOpenNFTsV1,
  IOpenNFTsV2: abiIOpenNFTsV2,
  IOpenNFTsV3: abiIOpenNFTsV3,
  IOpenNFTsV4: abiIOpenNFTsV4,
  IOpenAutoMarket: abiIOpenAutoMarket,
  IOpenBound: abiIOpenBound,

  ICloneFactoryV2: abiICloneFactoryV2,
  INFTsFactoryV2: abiINFTsFactoryV2,
  IOpenNFTsFactoryV3: abiIOpenNFTsFactoryV3,

  IOpenNFTsOld: abiIOpenNFTsOld,
  IOpenNFTsV3Plus: abiIOpenNFTsV3Plus
};

const abis = new Map(Object.entries(abisObject));

export { abis };
