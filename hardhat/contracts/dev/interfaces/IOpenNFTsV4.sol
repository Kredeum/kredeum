// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenNFTsV4 {
    function open() external view returns (bool);

    function burnable() external view returns (bool);
}
