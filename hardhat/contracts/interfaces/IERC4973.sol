// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC4973 {
    event Attest(address indexed _to, uint256 indexed _tokenId);

    // event Revoke(address indexed _to, uint256 indexed _tokenId);

    function ownerOf(uint256 _tokenId) external view returns (address);

    // function burn(uint256 _tokenId) external;
}
