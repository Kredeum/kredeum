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
    bytes4[] private _interfaceIds = new bytes4[](11);

    function initialize(address owner_) external override(INFTsResolver) {
        OpenERC173._initialize(owner_);

        uint256 i;

        _interfaceIds[i++] = type(IOpenNFTs).interfaceId;
        _interfaceIds[i++] = type(IOpenChecker).interfaceId;
        _interfaceIds[i++] = type(IOpenCloneable).interfaceId;
        _interfaceIds[i++] = type(IOpenMarketable).interfaceId;
        _interfaceIds[i++] = type(IOpenPauseable).interfaceId;

        _interfaceIds[i++] = type(IOpenNFTsV0).interfaceId;
        _interfaceIds[i++] = type(IOpenNFTsV1).interfaceId;
        _interfaceIds[i++] = type(IOpenNFTsV2).interfaceId;
        _interfaceIds[i++] = type(IOpenNFTsV3).interfaceId;
        _interfaceIds[i++] = type(IOpenNFTsV4).interfaceId;
        _interfaceIds[i++] = type(IOpenBound).interfaceId;
    }

    function getNFTsResolverCollectionInfos(address collection, address account)
        external
        view
        override(INFTsResolver)
        returns (CollectionInfos memory collectionInfos)
    {
        collectionInfos = _getCollectionInfos(collection, account, _interfaceIds);
    }

    function getNFTsResolverCollectionsInfos(address account)
        external
        view
        override(INFTsResolver)
        returns (CollectionInfos[] memory collectionsInfos)
    {
        collectionsInfos = _getCollectionsInfos(account, _interfaceIds);
    }

    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return interfaceId == type(INFTsResolver).interfaceId || super.supportsInterface(interfaceId);
    }
}
