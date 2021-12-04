// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "./interfaces/IOpenNFTsV0.sol";
import "./interfaces/IOpenNFTsV1.sol";
import "./interfaces/IOpenNFTsV2.sol";

contract InterfacesIds {
  function ids() public pure returns (bytes4[] memory interfacesIds) {
    interfacesIds = new bytes4[](7);
    interfacesIds[0] = type(IERC165).interfaceId;
    interfacesIds[1] = type(IERC721).interfaceId;
    interfacesIds[2] = type(IERC721Metadata).interfaceId;
    interfacesIds[3] = type(IERC721Enumerable).interfaceId;
    interfacesIds[4] = type(IOpenNFTsV0).interfaceId;
    interfacesIds[5] = type(IOpenNFTsV1).interfaceId;
    interfacesIds[6] = type(IOpenNFTsV2).interfaceId;
  }
}
