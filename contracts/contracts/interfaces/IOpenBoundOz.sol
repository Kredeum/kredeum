// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOpenBoundOz {
    function mint(uint256 tokenID) external returns (uint256);

    function claim(uint256 tokenID, uint256 cid) external;

    function burn(uint256 tokenID) external;

    function getMyTokenID(uint256 cid) external view returns (uint256);

    function getCID(uint256 tokenID) external view returns (uint256);

    function getTokenID(uint256 cid, address addr) external pure returns (uint256);
}
