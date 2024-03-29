// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOpenProof {
    function mintOpenProof(address minter, string memory jsonURI) external returns (uint256);
}
