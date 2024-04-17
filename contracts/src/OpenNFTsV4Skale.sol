// SPDX-License-Identifier: MIT
//
//   OpenERC165
//   (supports)
//       |
//       ———————————————————————————————————————————————————
//       |                                    |            |
//   OpenERC721                          OpenERC173  OpenCloneable
//     (NFT)                              (ownable)        |
//       |                                    |            |
//       ——————————————————————————           |            |
//       |                        |           |            |
//  OpenERC721Metadata  OpenERC721Enumerable  |            |
//       |                        |           |            |
//       ———————————————————————————————————————————————————
//       |
//   OpenNFTsV4
//       |
//   OpenNFTsV4Skale —— IOpenNFTsV4Skale
//
pragma solidity ^0.8.9;

import {OpenNFTsV4} from "./OpenNFTsV4.sol";
import {IOpenNFTsV4Skale} from "./interfaces/IOpenNFTsV4Skale.sol";

/// @title OpenNFTsV4Skale smartcontract
contract OpenNFTsV4Skale is IOpenNFTsV4Skale, OpenNFTsV4 {
    /// @notice avoid over-sized tokenURI
    uint256 public tokenUriMaxLength = type(uint256).max;

    /// @notice minimum time between two Mints
    uint256 public cooldownPeriod = type(uint256).max;

    /// @notice timestamp of next possible Mint per User
    mapping(address => uint256) private _cooldown;

    /// @notice set max size for tokenURI
    /// @param tokenUriMaxLength_ max tokenURI size
    function setTokenUriMaxLength(uint256 tokenUriMaxLength_) external override(IOpenNFTsV4Skale) onlyOwner {
        tokenUriMaxLength = tokenUriMaxLength_;
    }

    /// @notice set minimum timstamp between two Mints
    /// @param cooldownPeriod_ minimum timestamp between txo Mints
    function setCooldownPeriod(uint256 cooldownPeriod_) external override(IOpenNFTsV4Skale) onlyOwner {
        cooldownPeriod = cooldownPeriod_;
    }

    function mint(string memory tokenURI_) external override(IOpenNFTsV4Skale, OpenNFTsV4) returns (uint256 tokenID) {
        tokenID = _mint(msg.sender, tokenURI_);
    }

    function mint(address minter, string memory tokenURI_)
        external
        override(IOpenNFTsV4Skale, OpenNFTsV4)
        onlyOwner
        returns (uint256 tokenID)
    {
        tokenID = _mint(minter, tokenURI_);
    }

    function _mint(address minter, string memory tokenURI) internal override(OpenNFTsV4) returns (uint256 tokenID) {
        tokenID = tokenIdNext++;

        _mint(minter, tokenURI, tokenID);
    }

    function _mint(address minter, string memory tokenURI, uint256 tokenID) internal override(OpenNFTsV4) {
        uint256 currentTimestamp = block.timestamp;

        require(bytes(tokenURI).length <= tokenUriMaxLength, "TokenURI too long");
        require(_cooldown[msg.sender] < currentTimestamp, "Mint cooldown");

        _cooldown[msg.sender] = currentTimestamp + cooldownPeriod;

        super._mint(minter, tokenURI, tokenID);
    }
}
