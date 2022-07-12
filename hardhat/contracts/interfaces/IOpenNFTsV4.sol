// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenNFTsV4 {
    function initialize(
        string memory name,
        string memory symbol,
        address owner,
        bool[] memory options
    ) external;

    function open() external view returns (bool);

    function mint(string memory jsonURI) external returns (uint256 tokenID);

    function mint(address minter, string memory jsonURI) external returns (uint256 tokenID);

    function burn(uint256 tokenID) external;

    function buy(uint256 tokenID) external payable;

    function withdraw(address to) external;
}
