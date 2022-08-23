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
//       ———————————————————————————————————————————————————————————————————————————
//       |                                                         |               |
//   OpenERC721                                               OpenERC173     OpenCloneable
//     (NFT)                                                   (ownable)           |
//       |                                                         |               |
//       —————————————————————————————————————————————      ————————               |
//       |                        |                  |      |      |               |
//  OpenERC721Metadata  OpenERC721Enumerable   OpenERC2981  |      |               |
//       |                        |           (RoyaltyInfo) |      |               |
//       |                        |                  |      |      |               |
//       |                        |                  ————————      |               |
//       |                        |                  |             |               |
//       |                        |            OpenMarketable OpenPauseable        |
//       |                        |                  |             |               |
//       ———————————————————————————————————————————————————————————————————————————
//       |
//    OpenNFTs
//       |
//   OpenNFTsV4 —— IOpenNFTsV4
//
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/OpenNFTs/OpenNFTs.sol";
import "../interfaces/IOpenNFTsV4.sol";
import {IOpenNFTs as IOpenNFTsOld} from "../interfaces/IOpenNFTs.old.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is IOpenNFTsV4, OpenNFTs {
    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyMinter() override(OpenNFTs) {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

    function buy(uint256 tokenID) external payable override(IOpenNFTsV4) {
        require(_exists(tokenID), "NFT doesn't exists");

        /// Get token price
        uint256 price = tokenPrice[tokenID];

        /// Require price defined
        require(price > 0, "Not to sell");

        /// Require enough value sent
        require(msg.value >= price, "Not enough funds");

        /// Get previous token owner
        address from = ownerOf(tokenID);
        assert(from != address(0));
        require(from != msg.sender, "Already token owner!");

        /// Transfer token
        this.safeTransferFrom{value: msg.value}(from, msg.sender, tokenID, "");

        /// Reset token price (to be eventualy defined by new owner)
        delete tokenPrice[tokenID];
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        uint256 defaultPrice_,
        address receiver_,
        uint96 fee_,
        bool[] memory options
    ) external override(IOpenNFTsV4) {
        OpenNFTs._initialize(name_, symbol_, owner_);
        open = options[0];

        _setDefaultPrice(defaultPrice_);
        _setDefaultRoyalty(receiver_, fee_);
    }

    function mint(string memory tokenURI) external override(IOpenNFTsV4) returns (uint256 tokenID) {
        tokenID = mint(msg.sender, tokenURI, 0, address(0), 0);
    }

    function parent() external view override(IOpenNFTsV4) returns (address parent_) {
        // eip1167 deployed code = 45 bytes = 10 bytes + 20 bytes address + 15 bytes
        // extract bytes 10 to 30: shift 2 bytes (16 bits) then truncate to address 20 bytes (uint160)
        return
            (address(this).code.length == 45)
                ? address(uint160(uint256(bytes32(address(this).code)) >> 16))
                : address(0);
    }

    function mint(
        address minter_,
        string memory tokenURI_,
        uint256 tokenPrice_,
        address receiver_,
        uint96 fee_
    ) public payable override(IOpenNFTsV4) onlyMinter onlyWhenNotPaused returns (uint256 tokenID) {
        tokenID = mint(minter_, tokenURI_);

        _setTokenPrice(tokenID, tokenPrice_);
        _setTokenRoyalty(tokenID, receiver_, fee_);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenNFTs) returns (bool) {
        return
            interfaceId == type(IOpenNFTsV4).interfaceId ||
            interfaceId == type(IOpenNFTsOld).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
