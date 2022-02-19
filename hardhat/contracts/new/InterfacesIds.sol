// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

import "../interfaces/IOpenNFTsV0.sol";
import "../interfaces/IOpenNFTsV1.sol";
import "../interfaces/IOpenNFTsV2.sol";
import "../interfaces/IOpenNFTsV3.sol";
import "../interfaces/IInterfacesIds.sol";

import "../interfaces/ICloneFactory.sol";
import "../interfaces/ICloneFactoryV2.sol";
import "../interfaces/INFTsFactory.sol";
import "../interfaces/INFTsFactoryV2.sol";

/// @title InterfaceIds calculation
/// @author zapaz.eth
/// @notice Calculates various ERC165, ERC721 and ERC1155 interface Ids
///  @notice and Kredeum OpenNFTs interface Ids
contract InterfacesIds is IInterfacesIds {
    /// @notice Main and only function to calculate Interface Ids
    /// @notice No params
    /// @return interfacesIds : Array of all interfaceIds
    function ids() external pure override(IInterfacesIds) returns (bytes4[] memory interfacesIds) {
        interfacesIds = new bytes4[](16);
        interfacesIds[0] = type(IERC165).interfaceId;

        interfacesIds[1] = type(IERC721).interfaceId;
        interfacesIds[2] = type(IERC721Receiver).interfaceId;
        interfacesIds[3] = type(IERC721Metadata).interfaceId;
        interfacesIds[4] = type(IERC721Enumerable).interfaceId;

        interfacesIds[5] = type(IERC1155).interfaceId;
        interfacesIds[6] = type(IERC1155Receiver).interfaceId;
        interfacesIds[7] = type(IERC1155MetadataURI).interfaceId;

        interfacesIds[8] = type(IOpenNFTsV0).interfaceId;
        interfacesIds[9] = type(IOpenNFTsV1).interfaceId;
        interfacesIds[10] = type(IOpenNFTsV2).interfaceId;
        interfacesIds[11] = type(IOpenNFTsV3).interfaceId;

        interfacesIds[12] = type(ICloneFactory).interfaceId;
        interfacesIds[13] = type(ICloneFactoryV2).interfaceId;
        interfacesIds[14] = type(INFTsFactory).interfaceId;
        interfacesIds[15] = type(INFTsFactoryV2).interfaceId;
    }
}
