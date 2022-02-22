// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IContractProbe {
    function probe(address addr) external view returns (bool isContract, address forwardedTo);
}
