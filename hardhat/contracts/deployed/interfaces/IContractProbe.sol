// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IContractProbe {
    function probe(address addr) external view returns (bool isContract, address forwardedTo);
}
