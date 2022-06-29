// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenNFTsV4 {
    event SetRoyalty(address receiver, uint96 feeNumerator);
    event SetRoyalty(address receiver, uint96 feeNumerator, uint256 tokenID);

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external;

    function setTokenRoyalty(
        address receiver,
        uint96 feeNumerator,
        uint256 tokenId
    ) external;

    function resetRoyalty(uint256 tokenId) external;

    function resetDefaultRoyalty() external;

    function open() external view returns (bool);

    function burnable() external view returns (bool);
}
