// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenBound {
    function mint(uint256 tokenID) external returns (uint256);

    function burn(uint256 tokenID) external;
}
