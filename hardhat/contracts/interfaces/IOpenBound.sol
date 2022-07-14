// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenBound {
    function mint(uint256 tokenID) external returns (uint256);

    function claim(uint256 tokenID, uint256 CID) external;

    function burn(uint256 tokenID) external;

    function getTokenID(uint256 CID, address addr) external pure returns (uint256);

    function getMyTokenID(uint256 CID) external view returns (uint256);

    function getCID(uint256 tokenID) external view returns (uint256);
}
