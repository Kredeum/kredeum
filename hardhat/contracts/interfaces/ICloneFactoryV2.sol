// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ICloneFactoryV2 {
    function implementationsAdd(address[] calldata implementationToAdd) external;

    function implementations(uint256 index) external view returns (address);

    function implementationsCount() external view returns (uint256);
}
