// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERCNftInfos.sol";

interface IOpenNFTsInfos is IERCNftInfos {
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
