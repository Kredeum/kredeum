// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../interfaces/IERC165.sol";

import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC721TokenReceiver.sol";

import "../interfaces/IERC1155.sol";
import "../interfaces/IERC1155MetadataURI.sol";
import "../interfaces/IERC1155TokenReceiver.sol";

import "../interfaces/IERC173.sol";
import "../interfaces/IERC2981.sol";

import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "OpenNFTs/contracts/interfaces/IOpenChecker.sol";
import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import "OpenNFTs/contracts/interfaces/IOpenPauseable.sol";

import "../interfaces/IOpenNFTsV0.sol";
import "../interfaces/IOpenNFTsV1.sol";
import "../interfaces/IOpenNFTsV2.sol";
import "../interfaces/IOpenNFTsV3.sol";
import "../interfaces/IOpenNFTsV4.sol";
import "../interfaces/IOpenBound.sol";

import "../interfaces/ICloneFactory.sol";
import "../interfaces/INFTsFactory.sol";
import "../interfaces/ICloneFactoryV2.sol";
import "../interfaces/INFTsFactoryV2.sol";

import {IOpenNFTs as IOpenNFTsOld} from "../interfaces/IOpenNFTs.old.sol";
import {IOpenNFTsV3 as IOpenNFTsV3Old} from "../interfaces/IOpenNFTsV3.old.sol";

import "../interfaces/IInterfacesIds.sol";

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
        uint256 imax = 27;

        interfacesIds = new bytes4[](imax);

        interfacesIds[i++] = bytes4(0xffffffff);
        interfacesIds[i++] = type(IERC165).interfaceId;

        interfacesIds[i++] = type(IERC721).interfaceId;
        interfacesIds[i++] = type(IERC721Metadata).interfaceId;
        interfacesIds[i++] = type(IERC721Enumerable).interfaceId;
        interfacesIds[i++] = type(IERC721TokenReceiver).interfaceId;

        interfacesIds[i++] = type(IERC1155).interfaceId;
        interfacesIds[i++] = type(IERC1155MetadataURI).interfaceId;
        interfacesIds[i++] = type(IERC1155TokenReceiver).interfaceId;

        interfacesIds[i++] = type(IERC173).interfaceId;
        interfacesIds[i++] = type(IERC2981).interfaceId;

        interfacesIds[i++] = type(IOpenNFTs).interfaceId;
        interfacesIds[i++] = type(IOpenChecker).interfaceId;
        interfacesIds[i++] = type(IOpenCloneable).interfaceId;
        interfacesIds[i++] = type(IOpenMarketable).interfaceId;
        interfacesIds[i++] = type(IOpenPauseable).interfaceId;

        interfacesIds[i++] = type(IOpenNFTsV0).interfaceId;
        interfacesIds[i++] = type(IOpenNFTsV1).interfaceId;
        interfacesIds[i++] = type(IOpenNFTsV2).interfaceId;
        interfacesIds[i++] = type(IOpenNFTsV3).interfaceId;
        interfacesIds[i++] = type(IOpenNFTsV4).interfaceId;
        interfacesIds[i++] = type(IOpenBound).interfaceId;

        interfacesIds[i++] = type(ICloneFactory).interfaceId;
        interfacesIds[i++] = type(INFTsFactory).interfaceId;
        interfacesIds[i++] = type(ICloneFactoryV2).interfaceId;
        interfacesIds[i++] = type(INFTsFactoryV2).interfaceId;

        interfacesIds[i++] = type(IOpenNFTsOld).interfaceId;
        interfacesIds[i++] = type(IOpenNFTsV3Old).interfaceId;

        interfacesIds[i++] = type(IInterfacesIds).interfaceId;

        assert(i == imax);
    }
}
