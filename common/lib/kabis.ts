import abiERC165 from "abis/contracts/interfaces/IERC165.sol/IERC165.json";
import abiERC173 from "abis/contracts/interfaces/IERC173.sol/IERC173.json";

import abiERC721 from "abis/contracts/interfaces/IERC721.sol/IERC721.json";
import abiERC721Enumerable from "abis/contracts/interfaces/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiERC721Metadata from "abis/contracts/interfaces/IERC721Metadata.sol/IERC721Metadata.json";
import abiERC721TokenReceiver from "abis/contracts/interfaces/IERC721TokenReceiver.sol/IERC721TokenReceiver.json";

import abiERC1155 from "abis/contracts/interfaces/IERC1155.sol/IERC1155.json";
import abiERC1155MetadataURI from "abis/contracts/interfaces/IERC1155MetadataURI.sol/IERC1155MetadataURI.json";
import abiERC1155TokenReceiver from "abis/contracts/interfaces/IERC1155TokenReceiver.sol/IERC1155TokenReceiver.json";
import abiERC2981 from "abis/contracts/interfaces/IERC2981.sol/IERC2981.json";

import abiOpenNFTs from "abis/contracts/interfaces/IOpenNFTs.sol/IOpenNFTs.json";
import abiOpenNFTsV0 from "abis/contracts/interfaces/IOpenNFTsV0.sol/IOpenNFTsV0.json";
import abiOpenNFTsV1 from "abis/contracts/interfaces/IOpenNFTsV1.sol/IOpenNFTsV1.json";
import abiOpenNFTsV2 from "abis/contracts/interfaces/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiOpenNFTsV3 from "abis/contracts/interfaces/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import abiOpenNFTsV4 from "abis/contracts/interfaces/IOpenNFTsV4.sol/IOpenNFTsV4.json";
import abiOpenBound from "abis/contracts/interfaces/IOpenBound.sol/IOpenBound.json";

import abiCloneFactory from "abis/contracts/interfaces/ICloneFactory.sol/ICloneFactory.json";
import abiNFTsFactory from "abis/contracts/interfaces/INFTsFactory.sol/INFTsFactory.json";
import abiCloneFactoryV2 from "abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";
import abiNFTsFactoryV2 from "abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";

import abiOpenCheckable from "abis/OpenNFTs/contracts/interfaces/IOpenCheckable.sol/IOpenCheckable.json";
import abiOpenCloneable from "abis/OpenNFTs/contracts/interfaces/IOpenCloneable.sol/IOpenCloneable.json";
import abiOpenMarketable from "abis/OpenNFTs/contracts/interfaces/IOpenMarketable.sol/IOpenMarketable.json";
import abiOpenPauseable from "abis/OpenNFTs/contracts/interfaces/IOpenPauseable.sol/IOpenPauseable.json";

const abis = {
  IERC165: abiERC165,
  IERC173: abiERC173,

  IERC721: abiERC721,
  IERC721Enumerable: abiERC721Enumerable,
  IERC721Metadata: abiERC721Metadata,
  IERC721TokenReceiver: abiERC721TokenReceiver,

  IERC1155: abiERC1155,
  IERC1155MetadataURI: abiERC1155MetadataURI,
  IERC1155TokenReceiver: abiERC1155TokenReceiver,

  IERC2981: abiERC2981,

  IOpenNFTs: abiOpenNFTs,
  IOpenNFTsV0: abiOpenNFTsV0,
  IOpenNFTsV1: abiOpenNFTsV1,
  IOpenNFTsV2: abiOpenNFTsV2,
  IOpenNFTsV3: abiOpenNFTsV3,
  IOpenNFTsV4: abiOpenNFTsV4,
  IOpenBound: abiOpenBound,

  ICloneFactory: abiCloneFactory,
  INFTsFactory: abiNFTsFactory,
  ICloneFactoryV2: abiCloneFactoryV2,
  INFTsFactoryV2: abiNFTsFactoryV2,

  IOpenCheckable: abiOpenCheckable,
  IOpenCloneable: abiOpenCloneable,
  IOpenMarketable: abiOpenMarketable,
  IOpenPauseable: abiOpenPauseable
};

export { abis };
