// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IOpenNFTsInfos.sol";

interface IOpenNFTsResolver is IOpenNFTsInfos {
    function getOpenNFTsNftInfos(address collection, uint256 tokenID)
        external
        view
        returns (NftInfos memory nftInfos, OpenNFTsNftInfos memory openNTFsnftInfos);

    function getOpenNFTsCollectionsInfos(address account)
        external
        view
        returns (CollectionInfos[] memory collectionsInfos, OpenNFTsCollectionInfos[] memory openNFTsCollectionsInfos);

    function getOpenNFTsCollectionInfos(address collection, address account)
        external
        view
        returns (CollectionInfos memory collectionInfos, OpenNFTsCollectionInfos memory openNTFscollectionInfos);
}
