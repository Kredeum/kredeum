// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IOpenNFTs} from "@opennfts/contracts/interfaces/IOpenNFTs.sol";
import {IOpenChecker} from "@opennfts/contracts/interfaces/IOpenChecker.sol";
import {IOpenCloneable} from "@opennfts/contracts/interfaces/IOpenCloneable.sol";
import {IOpenMarketable} from "@opennfts/contracts/interfaces/IOpenMarketable.sol";
import {IOpenPauseable} from "@opennfts/contracts/interfaces/IOpenPauseable.sol";

import {IOpenNFTsV4} from "../interfaces/IOpenNFTsV4.sol";
import {IOpenAutoMarket} from "../interfaces/IOpenAutoMarket.sol";
import {IOpenBound} from "../interfaces/IOpenBound.sol";
import {IOpenNFTsFactoryV3} from "../interfaces/IOpenNFTsFactoryV3.sol";
import {IInterfacesIds} from "../interfaces/IInterfacesIds.sol";

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
