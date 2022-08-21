// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERC721Infos.sol";

interface INFTsResolver is IERC721Infos {
    function initialize(address owner) external;

    function getNFTsResolverCollectionsInfos(address account)
        external
        view
        returns (CollectionInfos[] memory collectionsInfos);

    function getNFTsResolverCollectionInfos(address collection, address account)
        external
        view
        returns (CollectionInfos memory collectionInfos);
}
