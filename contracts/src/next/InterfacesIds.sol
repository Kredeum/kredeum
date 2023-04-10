// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC165} from "OpenNFTs/contracts/interfaces/IERC165.sol";

import {IERC721} from "OpenNFTs/contracts/interfaces/IERC721.sol";
import {IERC721Metadata} from "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import {IERC721Enumerable} from "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import {IERC721TokenReceiver} from "OpenNFTs/contracts/interfaces/IERC721TokenReceiver.sol";

import {IERC1155} from "OpenNFTs/contracts/interfaces/IERC1155.sol";
import {IERC1155MetadataURI} from "OpenNFTs/contracts/interfaces/IERC1155MetadataURI.sol";
import {IERC1155TokenReceiver} from "OpenNFTs/contracts/interfaces/IERC1155TokenReceiver.sol";

import {IERC173} from "OpenNFTs/contracts/interfaces/IERC173.sol";
import {IERC2981} from "OpenNFTs/contracts/interfaces/IERC2981.sol";

import {IOpenNFTs} from "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import {IOpenChecker} from "OpenNFTs/contracts/interfaces/IOpenChecker.sol";
import {IOpenCloneable} from "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import {IOpenMarketable} from "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import {IOpenPauseable} from "OpenNFTs/contracts/interfaces/IOpenPauseable.sol";

import {IOpenNFTsV0} from "src/interfaces/IOpenNFTsV0.sol";
import {IOpenNFTsV1} from "src/interfaces/IOpenNFTsV1.sol";
import {IOpenNFTsV2} from "src/interfaces/IOpenNFTsV2.sol";
import {IOpenNFTsV3} from "src/interfaces/IOpenNFTsV3.sol";
import {IOpenNFTsV4} from "src/interfaces/IOpenNFTsV4.sol";
import {IOpenAutoMarket} from "src/interfaces/IOpenAutoMarket.sol";
import {IOpenBound} from "src/interfaces/IOpenBound.sol";

import {ICloneFactoryV2} from "src/interfaces/ICloneFactoryV2.sol";
import {INFTsFactoryV2} from "src/interfaces/INFTsFactoryV2.sol";
import {IOpenNFTsFactoryV3} from "src/interfaces/IOpenNFTsFactoryV3.sol";

import {IOpenNFTsResolver} from "src/interfaces/IOpenNFTsResolver.sol";

import {IOpenNFTs as IOpenNFTsOld} from "src/interfaces/IOpenNFTs.old.sol";
import {IOpenNFTsV3Plus} from "src/interfaces/IOpenNFTsV3Plus.sol";

import {IInterfacesIds} from "src/interfaces/IInterfacesIds.sol";

/// @title InterfaceIds calculation
/// @author zapaz.eth
/// @notice Calculates various ERC165, ERC721 and ERC1155 interface Ids
///  @notice and Kredeum OpenNFTs interface Ids
contract InterfacesIds is IInterfacesIds {
    /// @notice Main and only function to calculate Interface Ids
    /// @notice No params
    /// @return interfacesIds : Array of all interfaceIds
    function ids() external pure override(IInterfacesIds) returns (bytes4[] memory interfacesIds) {
        uint256 i;
        uint256 imax = 28;

        interfacesIds = new bytes4[](imax);

        interfacesIds[i++] = bytes4(0x01ffc9a7); // IERC165

        interfacesIds[i++] = bytes4(0x80ac58cd); // IERC721
        interfacesIds[i++] = bytes4(0x780e9d63); // IERC721Enumerable
        interfacesIds[i++] = bytes4(0x5b5e139f); // IERC721Metadata
        interfacesIds[i++] = bytes4(0x150b7a02); // IERC721TokenReceiver

        interfacesIds[i++] = bytes4(0xd9b67a26); // IERC1155
        interfacesIds[i++] = bytes4(0x0e89341c); // IERC1155MetadataURI
        interfacesIds[i++] = bytes4(0x4e2312e0); // IERC1155TokenReceiver

        interfacesIds[i++] = bytes4(0x7f5828d0); // IERC173
        interfacesIds[i++] = bytes4(0x2a55205a); // IERC2981

        interfacesIds[i++] = type(IOpenNFTs).interfaceId;
        interfacesIds[i++] = type(IOpenChecker).interfaceId;
        interfacesIds[i++] = type(IOpenCloneable).interfaceId;
        interfacesIds[i++] = type(IOpenMarketable).interfaceId;
        interfacesIds[i++] = type(IOpenPauseable).interfaceId;

        interfacesIds[i++] = bytes4(0x4b68d431); // IOpenNFTsV0
        interfacesIds[i++] = bytes4(0xeacabe14); // IOpenNFTsV1
        interfacesIds[i++] = bytes4(0xd94a1db2); // IOpenNFTsV2
        interfacesIds[i++] = bytes4(0x5c838d8b); // IOpenNFTsV3
        interfacesIds[i++] = type(IOpenNFTsV4).interfaceId;
        interfacesIds[i++] = type(IOpenAutoMarket).interfaceId;
        interfacesIds[i++] = type(IOpenBound).interfaceId;

        interfacesIds[i++] = bytes4(0xcfc6c434); // ICloneFactoryV2
        interfacesIds[i++] = bytes4(0x78f5e5c2); // INFTsFactoryV2
        interfacesIds[i++] = type(IOpenNFTsFactoryV3).interfaceId; // IOpenNFTsFactoryV3

        interfacesIds[i++] = bytes4(0x03dc8d64); // IOpenNFTsOld
        interfacesIds[i++] = bytes4(0x5f5f00ef); // IOpenNFTsV3Plus

        interfacesIds[i++] = type(IInterfacesIds).interfaceId;

        assert(i == imax);
    }
}
