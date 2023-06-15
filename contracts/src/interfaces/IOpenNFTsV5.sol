// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOpenNFTsV5 {
    function mint(string memory tokenURI) external returns (uint256 tokenID);

    function mint(address minter, string memory tokenURI) external returns (uint256 tokenID);

    function burn(uint256 tokenID) external;

    function open() external view returns (bool);
}
