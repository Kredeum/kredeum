// SPDX-License-Identifier: MIT
//
//    OpenERC165
//        |

//        |
//   OpenResolver
//        |
//  OpenResolver 
//
//  NFTsResolver —— INFTsResolver
//
pragma solidity 0.8.9;

import "OpenNFTs/contracts/OpenResolver/OpenResolver.sol";
import "../interfaces/INFTsResolver.sol";

contract NFTsResolver is INFTsResolver, OpenResolver {
    function initialize(address owner_) external override(INFTsResolver) {
        OpenERC173._initialize(owner_);
    } 

    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return  interfaceId == type(INFTsResolver).interfaceId || super.supportsInterface(interfaceId);
    }
}
