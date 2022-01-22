// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IOpenNFTsV3 {
    function initialize(
        string memory name,
        string memory symbol,
        address owner,
        bool openMinting
    ) external;

    function mintNFT(address minter, string memory jsonURI) external returns (uint256 tokenID);

    function burnNFT(uint256 tokenID) external;
}
