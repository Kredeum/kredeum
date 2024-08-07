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
//   OpenNFTsV5 —— IOpenNFTsV5
//
pragma solidity ^0.8.9;

import {OpenERC721} from "@opennfts/contracts/OpenERC/OpenERC721.sol";
import {OpenERC721Metadata} from "@opennfts/contracts/OpenERC/OpenERC721Metadata.sol";
import {OpenERC721Enumerable} from "@opennfts/contracts/OpenERC/OpenERC721Enumerable.sol";
import {OpenERC721TokenReceiver} from "@opennfts/contracts/OpenERC/OpenERC721TokenReceiver.sol";
import {OpenERC173} from "@opennfts/contracts/OpenERC/OpenERC173.sol";
import {OpenCloneable} from "@opennfts/contracts/OpenCloner/OpenCloneable.sol";

import {IOpenNFTsV5} from "src/interfaces/IOpenNFTsV5.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV5 is
    IOpenNFTsV5,
    OpenERC721Metadata,
    OpenERC721Enumerable,
    OpenERC173,
    OpenCloneable,
    OpenERC721TokenReceiver
{
    /// @notice tokenID of next minted NFT
    uint256 public tokenIdNext;

    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyMinter() {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

    function mint(string memory tokenURI_) external override(IOpenNFTsV5) returns (uint256 tokenID) {
        tokenID = _mint(msg.sender, tokenURI_);
    }

    function mint(address minter, string memory tokenURI_)
        external
        override(IOpenNFTsV5)
        onlyOwner
        returns (uint256 tokenID)
    {
        tokenID = _mint(minter, tokenURI_);
    }

    /// @notice burn NFT
    /// @param tokenID tokenID of NFT to burn
    function burn(uint256 tokenID) external override(IOpenNFTsV5) onlyTokenOwnerOrApproved(tokenID) {
        _burn(tokenID);
    }

    function onERC721Received(address, address, uint256, bytes calldata)
        external
        pure
        override(OpenERC721TokenReceiver)
        returns (bytes4)
    {
        revert("Not accepting NFT");
    }

    function initialize(string memory name_, string memory symbol_, address owner_, bytes memory params_)
        public
        override(OpenCloneable)
    {
        (bytes memory subparams_,,) = abi.decode(params_, (bytes, address, uint96));

        (,,, bool[] memory options_) = abi.decode(subparams_, (uint256, address, uint96, bool[]));
        open = options_[0];

        tokenIdNext = 1;

        OpenCloneable._initialize("OpenNFTsV4", 4);
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
        return interfaceId == type(IOpenNFTsV5).interfaceId || super.supportsInterface(interfaceId);
    }

    function _mint(address minter, string memory tokenURI) internal returns (uint256 tokenID) {
        tokenID = tokenIdNext++;

        _mint(minter, tokenURI, tokenID);
    }

    function _mint(address minter, string memory tokenURI, uint256 tokenID)
        internal
        override(OpenERC721Enumerable, OpenERC721Metadata)
    {
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
