// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (utils/introspection/ERC165.sol)
pragma solidity 0.8.9;

import "../interfaces/IERC165.sol";

abstract contract OpenERC165 is IERC165 {
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == 0x01ffc9a7; // = type(IERC165).interfaceId
    }
}
