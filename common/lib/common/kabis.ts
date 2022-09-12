import abiIERC165 from "@abis/OpenNFTs/contracts/interfaces/IERC165.sol/IERC165.json";

import abiIERC721 from "@abis/OpenNFTs/contracts/interfaces/IERC721.sol/IERC721.json";
import abiIERC721Enumerable from "@abis/OpenNFTs/contracts/interfaces/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiIERC721Metadata from "@abis/OpenNFTs/contracts/interfaces/IERC721Metadata.sol/IERC721Metadata.json";
import abiIERC721TokenReceiver from "@abis/OpenNFTs/contracts/interfaces/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";
// import abiIERC721Events from "@abis/OpenNFTs/contracts/interfaces/IERC721Events.sol/IERC721Events.json";
// import abiIERCNftInfos from "@abis/OpenNFTs/contracts/interfaces/IERCNftInfos.sol/IERCNftInfos.json";

import abiIERC1155 from "@abis/OpenNFTs/contracts/interfaces/IERC1155.sol/IERC1155.json";
import abiIERC1155MetadataURI from "@abis/OpenNFTs/contracts/interfaces/IERC1155MetadataURI.sol/IERC1155MetadataURI.json";
import abiIERC1155TokenReceiver from "@abis/OpenNFTs/contracts/interfaces/IERC1155TokenReceiver.sol/IERC1155TokenReceiver.json";

// import abiIERC20 from "@abis/OpenNFTs/contracts/interfaces/IERC20.sol/IERC20.json";
import abiIERC173 from "@abis/OpenNFTs/contracts/interfaces/IERC173.sol/IERC173.json";
import abiIERC2981 from "@abis/OpenNFTs/contracts/interfaces/IERC2981.sol/IERC2981.json";

import abiIOpenNFTs from "@abis/OpenNFTs/contracts/interfaces/IOpenNFTs.sol/IOpenNFTs.json";
import abiIOpenChecker from "@abis/OpenNFTs/contracts/interfaces/IOpenChecker.sol/IOpenChecker.json";
import abiIOpenCloneable from "@abis/OpenNFTs/contracts/interfaces/IOpenCloneable.sol/IOpenCloneable.json";
import abiIOpenMarketable from "@abis/OpenNFTs/contracts/interfaces/IOpenMarketable.sol/IOpenMarketable.json";
import abiIOpenPauseable from "@abis/OpenNFTs/contracts/interfaces/IOpenPauseable.sol/IOpenPauseable.json";

import abiIOpenNFTsV0 from "@abis/contracts/interfaces/IOpenNFTsV0.sol/IOpenNFTsV0.json";
import abiIOpenNFTsV1 from "@abis/contracts/interfaces/IOpenNFTsV1.sol/IOpenNFTsV1.json";
import abiIOpenNFTsV2 from "@abis/contracts/interfaces/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiIOpenNFTsV3 from "@abis/contracts/interfaces/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import abiIOpenNFTsV4 from "@abis/contracts/interfaces/IOpenNFTsV4.sol/IOpenNFTsV4.json";
import abiIOpenBound from "@abis/contracts/interfaces/IOpenBound.sol/IOpenBound.json";

import abiICloneFactoryV2 from "@abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";
import abiINFTsFactoryV2 from "@abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import abiIOpenNFTsFactoryV3 from "@abis/contracts/interfaces/IOpenNFTsFactoryV3.sol/IOpenNFTsFactoryV3.json";

import abiIOpenNFTsOld from "@abis/contracts/interfaces/IOpenNFTs.old.sol/IOpenNFTs.json";
import abiIOpenNFTsV3Old from "@abis/contracts/interfaces/IOpenNFTsV3.old.sol/IOpenNFTsV3.json";

const abis = {
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
  IOpenBound: abiIOpenBound,

  ICloneFactoryV2: abiICloneFactoryV2,
  INFTsFactoryV2: abiINFTsFactoryV2,
  IOpenNFTsFactoryV3: abiIOpenNFTsFactoryV3,

  IOpenNFTsOld: abiIOpenNFTsOld,
  IOpenNFTsV3Old: abiIOpenNFTsV3Old
};

export { abis };
