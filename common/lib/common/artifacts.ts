import artifactIERC165 from "@artifacts/IERC165.sol/IERC165.json";

import artifactIERC721 from "@artifacts/IERC721.sol/IERC721.json";
import artifactIERC721Enumerable from "@artifacts/IERC721Enumerable.sol/IERC721Enumerable.json";
import artifactIERC721Metadata from "@artifacts/IERC721Metadata.sol/IERC721Metadata.json";
import artifactIERC721TokenReceiver from "@artifacts/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";
// import artifactIERC721Events from "@artifacts/IERC721Events.sol/IERC721Events.json";
// import artifactIERCNftInfos from "@artifacts/IERCNftInfos.sol/IERCNftInfos.json";

import artifactIERC1155 from "@artifacts/IERC1155.sol/IERC1155.json";
import artifactIERC1155MetadataURI from "@artifacts/IERC1155MetadataURI.sol/IERC1155MetadataURI.json";
import artifactIERC1155TokenReceiver from "@artifacts/IERC1155TokenReceiver.sol/IERC1155TokenReceiver.json";

// import artifactIERC20 from "@artifacts/IERC20.sol/IERC20.json";
import artifactIERC173 from "@artifacts/IERC173.sol/IERC173.json";
import artifactIERC2981 from "@artifacts/IERC2981.sol/IERC2981.json";

import artifactIOpenNFTs from "@artifacts/IOpenNFTs.sol/IOpenNFTs.json";
import artifactIOpenChecker from "@artifacts/IOpenChecker.sol/IOpenChecker.json";
import artifactIOpenCloneable from "@artifacts/IOpenCloneable.sol/IOpenCloneable.json";
import artifactIOpenMarketable from "@artifacts/IOpenMarketable.sol/IOpenMarketable.json";
import artifactIOpenPauseable from "@artifacts/IOpenPauseable.sol/IOpenPauseable.json";

import artifactIOpenNFTsV0 from "@artifacts/IOpenNFTsV0.sol/IOpenNFTsV0.json";
import artifactIOpenNFTsV1 from "@artifacts/IOpenNFTsV1.sol/IOpenNFTsV1.json";
import artifactIOpenNFTsV2 from "@artifacts/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import artifactIOpenNFTsV3 from "@artifacts/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import artifactIOpenNFTsV4 from "@artifacts/IOpenNFTsV4.sol/IOpenNFTsV4.json";
import artifactIOpenAutoMarket from "@artifacts/IOpenAutoMarket.sol/IOpenAutoMarket.json";
import artifactIOpenBound from "@artifacts/IOpenBound.sol/IOpenBound.json";

import artifactICloneFactoryV2 from "@artifacts/ICloneFactoryV2.sol/ICloneFactoryV2.json";
import artifactINFTsFactoryV2 from "@artifacts/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import artifactIOpenNFTsFactoryV3 from "@artifacts/IOpenNFTsFactoryV3.sol/IOpenNFTsFactoryV3.json";

import artifactIOpenNFTsOld from "@artifacts/IOpenNFTsOld.sol/IOpenNFTsOld.json";
import artifactIOpenNFTsV3Plus from "@artifacts/IOpenNFTsV3Plus.sol/IOpenNFTsV3Plus.json";

import artifactOpenNFTsFactoryV3 from "@artifacts/OpenNFTsFactoryV3.sol/OpenNFTsFactoryV3.json";
import artifactOpenNFTsResolver from "@artifacts/OpenNFTsResolver.sol/OpenNFTsResolver.json";

const artifactsObject = {
  IERC165: artifactIERC165,

  IERC721: artifactIERC721,
  IERC721Enumerable: artifactIERC721Enumerable,
  IERC721Metadata: artifactIERC721Metadata,
  IERC721TokenReceiver: artifactIERC721TokenReceiver,

  IERC1155: artifactIERC1155,
  IERC1155MetadataURI: artifactIERC1155MetadataURI,
  IERC1155TokenReceiver: artifactIERC1155TokenReceiver,

  IERC173: artifactIERC173,
  IERC2981: artifactIERC2981,

  IOpenNFTs: artifactIOpenNFTs,
  IOpenChecker: artifactIOpenChecker,
  IOpenCloneable: artifactIOpenCloneable,
  IOpenMarketable: artifactIOpenMarketable,
  IOpenPauseable: artifactIOpenPauseable,

  IOpenNFTsV0: artifactIOpenNFTsV0,
  IOpenNFTsV1: artifactIOpenNFTsV1,
  IOpenNFTsV2: artifactIOpenNFTsV2,
  IOpenNFTsV3: artifactIOpenNFTsV3,
  IOpenNFTsV4: artifactIOpenNFTsV4,
  IOpenAutoMarket: artifactIOpenAutoMarket,
  IOpenBound: artifactIOpenBound,

  ICloneFactoryV2: artifactICloneFactoryV2,
  INFTsFactoryV2: artifactINFTsFactoryV2,
  IOpenNFTsFactoryV3: artifactIOpenNFTsFactoryV3,

  IOpenNFTsOld: artifactIOpenNFTsOld,
  IOpenNFTsV3Plus: artifactIOpenNFTsV3Plus,

  OpenNFTsFactoryV3: artifactOpenNFTsFactoryV3,
  OpenNFTsResolver: artifactOpenNFTsResolver
};

const artifactsMap = new Map(Object.entries(artifactsObject));

const getAbi = (interfaceName: string) => {
  return artifactsMap.get(interfaceName)?.abi || {};
};

const getArtifact = (interfaceName: string) => {
  return artifactsMap.get(interfaceName) || {};
};

export { getAbi, getArtifact };
