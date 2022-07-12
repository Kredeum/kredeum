// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenMulti {
    function claim(uint256 tokenID) external;

    function exists(uint256) external returns (bool);
}
