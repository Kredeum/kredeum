// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenNFTsV4 {
    event SetRoyalty(address receiver, uint96 feeNumerator);
    event SetTokenRoyalty(uint256 tokenID, address receiver, uint96 feeNumerator);

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external;

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external;

    function setTokenPrice(uint256 tokenId, uint256 price) external;

    function open() external view returns (bool);

    function mint(string memory jsonURI) external returns (uint256 tokenID);

    function mintFor(address minter, string memory jsonURI) external returns (uint256 tokenID);

    function burn(uint256 tokenID) external;

    function buy(uint256 tokenID) external payable;

    function withdraw(address to) external;
}
