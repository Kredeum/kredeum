// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenNFTsV3 {
    function initialize(
        string memory name,
        string memory symbol,
        address owner,
        bool[] memory options
    ) external;

    function mintOpenNFT(address minter, string memory jsonURI) external returns (uint256 tokenID);

    function burnOpenNFT(uint256 tokenID) external;

    function open() external view returns (bool);

    function burnable() external view returns (bool);
}
