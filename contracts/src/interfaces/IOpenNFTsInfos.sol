// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERCNftInfos} from "OpenNFTs/contracts/interfaces/IERCNftInfos.sol";
import {IOpenReceiverInfos} from "OpenNFTs/contracts/interfaces/IOpenReceiverInfos.sol";

interface IOpenNFTsInfos is IERCNftInfos, IOpenReceiverInfos {
    struct OpenNFTsCollectionInfos {
        uint256 version;
        string template;
        bool open;
        bool minimal;
        uint256 price;
        ReceiverInfos receiver;
    }

    struct OpenNFTsNftInfos {
        uint256 price;
        ReceiverInfos receiver;
    }
}
