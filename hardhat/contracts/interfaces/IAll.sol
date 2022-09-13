// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERC165.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "OpenNFTs/contracts/interfaces/IERC721TokenReceiver.sol";
import "OpenNFTs/contracts/interfaces/IERCNftInfos.sol";
import "OpenNFTs/contracts/interfaces/IERC721Events.sol";

import "OpenNFTs/contracts/interfaces/IERC1155.sol";
import "OpenNFTs/contracts/interfaces/IERC1155MetadataURI.sol";
import "OpenNFTs/contracts/interfaces/IERC1155TokenReceiver.sol";

import "OpenNFTs/contracts/interfaces/IERC20.sol";
import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";

import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "OpenNFTs/contracts/interfaces/IOpenChecker.sol";
import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import "OpenNFTs/contracts/interfaces/IOpenPauseable.sol";

import "./ICloneFactoryV2.sol";
import "./INFTsFactoryV2.sol";
import "./IOpenFactoryV3.sol";
import "./IOpenNFTsV0.sol";
import "./IOpenNFTsV1.sol";
import "./IOpenNFTsV2.sol";
import "./IOpenNFTsV3.sol";
import "./IOpenNFTsV4.sol";
import "./IOpenBound.sol";
