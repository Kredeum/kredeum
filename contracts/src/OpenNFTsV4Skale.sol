// SPDX-License-Identifier: MIT
//
// Derived from Kredeum NFTs
// https://github.com/Kredeum/kredeum
//
//       ___           ___         ___           ___                    ___           ___                     ___
//      /  /\         /  /\       /  /\         /__/\                  /__/\         /  /\        ___        /  /\
//     /  /::\       /  /::\     /  /:/_        \  \:\                 \  \:\       /  /:/_      /  /\      /  /:/_
//    /  /:/\:\     /  /:/\:\   /  /:/ /\        \  \:\                 \  \:\     /  /:/ /\    /  /:/     /  /:/ /\
//   /  /:/  \:\   /  /:/~/:/  /  /:/ /:/_   _____\__\:\            _____\__\:\   /  /:/ /:/   /  /:/     /  /:/ /::\
//  /__/:/ \__\:\ /__/:/ /:/  /__/:/ /:/ /\ /__/::::::::\          /__/::::::::\ /__/:/ /:/   /  /::\    /__/:/ /:/\:\
//  \  \:\ /  /:/ \  \:\/:/   \  \:\/:/ /:/ \  \:\~~\~~\/          \  \:\~~\~~\/ \  \:\/:/   /__/:/\:\   \  \:\/:/~/:/
//   \  \:\  /:/   \  \::/     \  \::/ /:/   \  \:\  ~~~            \  \:\  ~~~   \  \::/    \__\/  \:\   \  \::/ /:/
//    \  \:\/:/     \  \:\      \  \:\/:/     \  \:\                 \  \:\        \  \:\         \  \:\   \__\/ /:/
//     \  \::/       \  \:\      \  \::/       \  \:\                 \  \:\        \  \:\         \__\/     /__/:/
//      \__\/         \__\/       \__\/         \__\/                  \__\/         \__\/                   \__\/
//
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
//   OpenNFTsV4Skale —— IOpenNFTsV4Skale
//
pragma solidity ^0.8.9;

import {OpenERC721} from "@opennfts/contracts/OpenERC/OpenERC721.sol";
import {OpenERC721Metadata} from "@opennfts/contracts/OpenERC/OpenERC721Metadata.sol";
import {OpenERC721Enumerable} from "@opennfts/contracts/OpenERC/OpenERC721Enumerable.sol";
import {OpenERC173} from "@opennfts/contracts/OpenERC/OpenERC173.sol";
import {OpenCloneable} from "@opennfts/contracts/OpenCloner/OpenCloneable.sol";
import {IOpenNFTsV4} from "./interfaces/IOpenNFTsV4.sol";
import {IOpenNFTsV4Skale} from "./interfaces/IOpenNFTsV4Skale.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4Skale is
    IOpenNFTsV4,
    IOpenNFTsV4Skale,
    OpenERC721Metadata,
    OpenERC721Enumerable,
    OpenERC173,
    OpenCloneable
{
    /// @notice tokenID of next minted NFT
    uint256 public tokenIdNext;

    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice avoid over-sized tokenURI
    uint256 public tokenUriMaxLength = type(uint256).max;

    /// @notice minimum time between two Mints
    uint256 public cooldownPeriod = type(uint256).max;

    /// @notice timestamp of next possible Mint per User
    mapping(address => uint256) private _cooldown;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyMinter() {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

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

    function mint(string memory tokenURI_) external override(IOpenNFTsV4) returns (uint256 tokenID) {
        tokenID = _mint(msg.sender, tokenURI_);
    }

    function mint(address minter, string memory tokenURI_)
        external
        override(IOpenNFTsV4)
        onlyOwner
        returns (uint256 tokenID)
    {
        tokenID = _mint(minter, tokenURI_);
    }

    /// @notice burn NFT
    /// @param tokenID tokenID of NFT to burn
    function burn(uint256 tokenID) external override(IOpenNFTsV4) onlyTokenOwnerOrApproved(tokenID) {
        _burn(tokenID);
    }

    function initialize(string memory name_, string memory symbol_, address owner_, bytes memory params_)
        public
        override(OpenCloneable)
    {
        (bytes memory subparams_,,) = abi.decode(params_, (bytes, address, uint96));

        (,,, bool[] memory options_) = abi.decode(subparams_, (uint256, address, uint96, bool[]));
        open = options_[0];

        tokenIdNext = 1;

        OpenCloneable._initialize("OpenNFTsV4Skale", 4);
        OpenERC721Metadata._initialize(name_, symbol_);
        OpenERC173._initialize(owner_);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(OpenERC721Metadata, OpenERC721Enumerable, OpenERC173, OpenCloneable)
        returns (bool)
    {
        return (interfaceId == type(IOpenNFTsV4).interfaceId) || (interfaceId == type(IOpenNFTsV4Skale).interfaceId)
            || super.supportsInterface(interfaceId);
    }

    function _mint(address minter, string memory tokenURI) internal returns (uint256 tokenID) {
        tokenID = tokenIdNext++;

        _mint(minter, tokenURI, tokenID);
    }

    function _mint(address minter, string memory tokenURI, uint256 tokenID)
        internal
        override(OpenERC721Enumerable, OpenERC721Metadata)
    {
        uint256 currentTimestamp = block.timestamp;

        require(bytes(tokenURI).length <= tokenUriMaxLength, "TokenURI too long");
        require(_cooldown[msg.sender] < currentTimestamp, "Mint cooldown");

        _cooldown[msg.sender] = currentTimestamp + cooldownPeriod;

        super._mint(minter, tokenURI, tokenID);
    }

    function _burn(uint256 tokenID) internal override(OpenERC721Enumerable, OpenERC721Metadata) {
        super._burn(tokenID);
    }

    function _transferFromBefore(address from, address to, uint256 tokenID)
        internal
        override(OpenERC721, OpenERC721Enumerable)
    {
        super._transferFromBefore(from, to, tokenID);
    }
}
