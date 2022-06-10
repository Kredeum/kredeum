// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenBound {
    function mint(uint256 cid) external;

    function claim(uint256 tokenID) external;
}
