// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IOpenNFTsInfos.sol";

interface IOpenNFTsResolver is IOpenNFTsInfos {
    function getOpenNFTsResolverCollectionsInfos(address account)
        external
        view
        returns (OpenNFTsCollectionInfos[] memory collectionsInfos);

    function getOpenNFTsResolverCollectionInfos(address collection, address account)
        external
        view
        returns (OpenNFTsCollectionInfos memory collectionInfos);
}
