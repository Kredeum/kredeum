// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERC721Infos.sol";

interface IOpenNFTsInfos is IERC721Infos {
    struct OpenNFTsCollectionInfos {
        uint256 version;
        string template;
        bool open;
        uint256 price;
        address receiver;
        uint96 fraction;
    }
    struct OpenNFTsNftInfos {
        uint256 price;
        address receiver;
        uint96 fraction;
    }
}
