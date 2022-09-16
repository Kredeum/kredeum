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
//   OpenAutoMarket —— IOpenAutoMarket
//
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/OpenNFTs/OpenNFTs.sol";
import "../interfaces/IOpenAutoMarket.sol";
import {IOpenNFTs as IOpenNFTsOld} from "../interfaces/IOpenNFTs.old.sol";

/// @title OpenNFTs smartcontract
contract OpenAutoMarket is IOpenAutoMarket, OpenNFTs {
    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyMinter() override(OpenNFTs) {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

    function buy(uint256 tokenID) external payable override(IOpenAutoMarket) existsToken(tokenID) {
        /// Get token price
        uint256 price = _tokenPrice[tokenID];

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
        delete _tokenPrice[tokenID];
    }

    function mint(string memory tokenURI) external override(IOpenAutoMarket) returns (uint256 tokenID) {
        tokenID = mint(msg.sender, tokenURI, 0, address(0), 0);
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        uint256 defaultPrice_,
        address receiver_,
        uint96 fee_,
        bool[] memory options
    ) public override(IOpenAutoMarket) {
        OpenNFTs._initialize(name_, symbol_, owner_);
        open = options[0];

        OpenMarketable._setDefaultPrice(defaultPrice_);
        OpenMarketable._setDefaultRoyalty(receiver_, fee_);
    }

    function mint(
        address minter_,
        string memory tokenURI_,
        uint256 tokenPrice_,
        address receiver_,
        uint96 fee_
    ) public payable override(IOpenAutoMarket) onlyMinter onlyWhenNotPaused returns (uint256 tokenID) {
        tokenID = OpenNFTs.mint(minter_, tokenURI_);

        OpenMarketable._setTokenPrice(tokenID, tokenPrice_);
        OpenMarketable._setTokenRoyalty(tokenID, receiver_, fee_);
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        bytes memory params_
    ) public virtual override(OpenCloneable) {
        (uint256 defaultPrice_, address receiver_, uint96 fee_, bool[] memory options_) = abi.decode(
            params_,
            (uint256, address, uint96, bool[])
        );
        initialize(name_, symbol_, owner_, defaultPrice_, receiver_, fee_, options_);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenNFTs) returns (bool) {
        return interfaceId == type(IOpenAutoMarket).interfaceId || super.supportsInterface(interfaceId);
    }
}
