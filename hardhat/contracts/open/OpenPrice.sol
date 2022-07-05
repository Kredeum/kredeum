// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (utils/introspection/ERC165.sol)
pragma solidity 0.8.9;

import "../interfaces/IOpenPrice.sol";

abstract contract OpenPrice {
    mapping(uint256 => uint256) public tokenPrice;

    function _setTokenPrice(uint256 tokenID, uint256 price) internal {
        tokenPrice[tokenID] = price;
    }
}
