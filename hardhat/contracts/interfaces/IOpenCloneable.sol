// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenCloneable {
    function getTemplate() external view returns (string memory);

    function getVersion() external view returns (uint256);
}
