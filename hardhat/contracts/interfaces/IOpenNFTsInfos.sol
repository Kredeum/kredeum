// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERC721Infos.sol";

interface IOpenNFTsInfos is IERC721Infos {
    struct OpenNFTsCollectionInfos {
        CollectionInfos collectionInfos;
        uint256 version;
        string template;
        bool open;
    }
}
