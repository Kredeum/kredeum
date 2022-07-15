// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC4973 {
    event Attest(address indexed to, uint256 indexed tokenID);

    // event Revoke(address indexed to, uint256 indexed tokenID);

    function ownerOf(uint256 tokenID) external view returns (address);

    // function burn(uint256 tokenID) external;
}
