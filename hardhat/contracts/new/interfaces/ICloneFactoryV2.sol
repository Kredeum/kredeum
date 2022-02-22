// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ICloneFactoryV2 {
    event ImplementationNew(address indexed implementation, address indexed creator, uint256 count);

    function implementationsCount() external view returns (uint256);

    function implementations(uint256 index) external view returns (address);

    function implementationsAdd(address[] calldata implementationToAdd) external;
}
