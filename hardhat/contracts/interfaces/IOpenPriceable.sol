// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenPriceable {
    event SetDefaultRoyalty(address receiver, uint96 fee);

    event SetTokenRoyalty(uint256 tokenID, address receiver, uint96 fee);

    function setDefaultRoyalty(address receiver, uint96 fee) external;

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 fee
    ) external;

    function setDefaultPrice(uint256 price) external;

    function setTokenPrice(uint256 tokenId) external;

    function setTokenPrice(uint256 tokenId, uint256 price) external;
}
