// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/interfaces/IERCNftInfos.sol";
import "OpenNFTs/contracts/interfaces/IOpenReceiverInfos.sol";

interface IOpenNFTsInfos is IERCNftInfos, IOpenReceiverInfos {
    struct OpenNFTsCollectionInfos {
        uint256 version;
        string template;
        bool open;
        uint256 price;
        ReceiverInfos receiver;
    }

    struct OpenNFTsNftInfos {
        uint256 price;
        ReceiverInfos receiver;
    }
}
