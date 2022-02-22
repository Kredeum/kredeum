// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICloneFactory {
    function addImplementation(address implementation) external;

    function setDefaultTemplate(address template) external;

    function setContractProbe(address probe) external;

    function implementations(uint256 index) external view returns (address);

    function implementationsCount() external view returns (uint256);
}
