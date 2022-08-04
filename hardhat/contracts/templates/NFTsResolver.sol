// SPDX-License-Identifier: MIT
//
//    OpenERC165
//        |

//        |
//   OpenResolver
//        |
//  OpenResolver —— IOpenResolver
//
pragma solidity 0.8.9;

import "OpenNFTs/contracts/OpenResolver/OpenResolver.sol";

contract NFTsResolver is OpenResolver {
    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
