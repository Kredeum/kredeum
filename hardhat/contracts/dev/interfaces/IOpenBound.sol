// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenBound {
    function mint(uint256 tokenID) external;

    function mint(address addr, uint256 tokenID) external;
}
