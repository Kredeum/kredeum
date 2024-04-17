// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOpenNFTsV4Skale {
    function setTokenUriMaxLength(uint256 tokenUriMaxLength_) external;

    function setCooldownPeriod(uint256 cooldownPeriod_) external;

    function mint(string memory tokenURI_) external returns (uint256 tokenID);

    function mint(address minter, string memory tokenURI_) external returns (uint256 tokenID);
}
