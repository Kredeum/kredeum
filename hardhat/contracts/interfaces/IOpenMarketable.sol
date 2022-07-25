// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenMarketable {
    event SetDefaultRoyalty(address receiver, uint96 fee);

    event SetTokenRoyalty(uint256 tokenID, address receiver, uint96 fee);

    function tokenPrice(uint256 tokenID) external returns (uint256 price);

    function setDefaultRoyalty(address receiver, uint96 fee) external;

    function setTokenRoyalty(
        uint256 tokenID,
        address receiver,
        uint96 fee
    ) external;

    function setDefaultPrice(uint256 price) external;

    function setTokenPrice(uint256 tokenID) external;

    function setTokenPrice(uint256 tokenID, uint256 price) external;
}
