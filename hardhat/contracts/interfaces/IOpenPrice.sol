// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenPrice {
    function setTokenPrice(uint256 tokenId, uint256 price) external;
}
