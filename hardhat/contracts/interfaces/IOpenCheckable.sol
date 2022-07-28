// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenCheckable {
    function checkSupportedInterfaces(bytes4[] memory interfaceIds) external view returns (bool[] memory);
}
