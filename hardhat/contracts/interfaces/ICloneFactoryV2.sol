// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ICloneFactoryV2 {
    function addImplementation(address implementation, address template) external;

    function implementations(uint256 index) external view returns (address);

    function implementationsCount() external view returns (uint256);
}
