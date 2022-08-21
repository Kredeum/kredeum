// SPDX-License-Identifier: MIT
//
//    OpenERC165
//        |
//  OpenResolver
//        |
//  NFTsResolver —— INFTsResolver
//
pragma solidity 0.8.9;

import "OpenNFTs/contracts/OpenResolver/OpenResolver.sol";
import "../interfaces/INFTsResolver.sol";
import "../interfaces/IAll.sol";

contract NFTsResolver is INFTsResolver, OpenResolver {
    bytes4[] private interfaceIds = new bytes4[](11);

    function initialize(address owner_) external override(INFTsResolver) {
        OpenERC173._initialize(owner_);

        uint256 i;

        interfaceIds[i++] = type(IOpenNFTs).interfaceId;
        interfaceIds[i++] = type(IOpenChecker).interfaceId;
        interfaceIds[i++] = type(IOpenCloneable).interfaceId;
        interfaceIds[i++] = type(IOpenMarketable).interfaceId;
        interfaceIds[i++] = type(IOpenPauseable).interfaceId;

        interfaceIds[i++] = type(IOpenNFTsV0).interfaceId;
        interfaceIds[i++] = type(IOpenNFTsV1).interfaceId;
        interfaceIds[i++] = type(IOpenNFTsV2).interfaceId;
        interfaceIds[i++] = type(IOpenNFTsV3).interfaceId;
        interfaceIds[i++] = type(IOpenNFTsV4).interfaceId;
        interfaceIds[i++] = type(IOpenBound).interfaceId;
    }

    function getNFTsResolverCollectionInfos(address collection, address account)
        external
        view
        override(INFTsResolver)
        returns (CollectionInfos memory collectionInfos)
    {
        collectionInfos = _getCollectionInfos(collection, account, interfaceIds);
    }

    function getNFTsResolverCollectionsInfos(address account)
        external
        view
        override(INFTsResolver)
        returns (CollectionInfos[] memory collectionsInfos)
    {
        collectionsInfos = _getCollectionsInfos(account, interfaceIds);
    }

    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return interfaceId == type(INFTsResolver).interfaceId || super.supportsInterface(interfaceId);
    }
}
