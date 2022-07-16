// SPDX-License-Identifier: MIT
//
//     /__/|         /  /\         /  /\        /  /::\        /  /\         /__/\         /__/\
//     |  |:|        /  /::\       /  /:/_      /  /:/\:\      /  /:/_        \  \:\       |  |::\
//     |  |:|       /  /:/\:\     /  /:/ /\    /  /:/  \:\    /  /:/ /\        \  \:\      |  |:|:\
//   __|  |:|      /  /:/~/:/    /  /:/ /:/_  /__/:/ \__\:|  /  /:/ /:/_   ___  \  \:\   __|__|:|\:\
//  /__/\_|:|____ /__/:/ /:/___ /__/:/ /:/ /\ \  \:\ /  /:/ /__/:/ /:/ /\ /__/\  \__\:\ /__/::::| \:\
//  \  \:\/:::::/ \  \:\/:::::/ \  \:\/:/ /:/  \  \:\  /:/  \  \:\/:/ /:/ \  \:\ /  /:/ \  \:\~~\__\/
//   \  \::/~~~~   \  \::/~~~~   \  \::/ /:/    \  \:\/:/    \  \::/ /:/   \  \:\  /:/   \  \:\
//    \  \:\        \  \:\        \  \:\/:/      \  \::/      \  \:\/:/     \  \:\/:/     \  \:\
//     \  \:\        \  \:\        \  \::/        \__\/        \  \::/       \  \::/       \  \:\
//      \__\/         \__\/         \__\/                       \__\/         \__\/         \__\/
//       ___           ___                     ___
//      /__/\         /  /\        ___        /  /\
//      \  \:\       /  /:/_      /  /\      /  /:/_
//       \  \:\     /  /:/ /\    /  /:/     /  /:/ /\
//   _____\__\:\   /  /:/ /:/   /  /:/     /  /:/ /::\
//  /__/::::::::\ /__/:/ /:/   /  /::\    /__/:/ /:/\:\
//  \  \:\~~\~~\/ \  \:\/:/   /__/:/\:\   \  \:\/:/~/:/
//   \  \:\  ~~~   \  \::/    \__\/  \:\   \  \::/ /:/
//    \  \:\        \  \:\         \  \:\   \__\/ /:/
//     \  \:\        \  \:\         \__\/     /__/:/
//      \__\/         \__\/                   \__\/
//       ___         ___           ___                       ___           ___
//      /  /\       /  /\         /  /\          ___        /  /\         /  /\          ___
//     /  /:/_     /  /::\       /  /:/         /  /\      /  /::\       /  /::\        /__/|
//    /  /:/ /\   /  /:/\:\     /  /:/         /  /:/     /  /:/\:\     /  /:/\:\      |  |:|
//   /  /:/ /:/  /  /:/~/::\   /  /:/  ___    /  /:/     /  /:/  \:\   /  /:/~/:/      |  |:|
//  /__/:/ /:/  /__/:/ /:/\:\ /__/:/  /  /\  /  /::\    /__/:/ \__\:\ /__/:/ /:/___  __|__|:|
//  \  \:\/:/   \  \:\/:/__\/ \  \:\ /  /:/ /__/:/\:\   \  \:\ /  /:/ \  \:\/:::::/ /__/::::\
//   \  \::/     \  \::/       \  \:\  /:/  \__\/  \:\   \  \:\  /:/   \  \::/~~~~     ~\~~\:\
//    \  \:\      \  \:\        \  \:\/:/        \  \:\   \  \:\/:/     \  \:\           \  \:\
//     \  \:\      \  \:\        \  \::/          \__\/    \  \::/       \  \:\           \__\/
//      \__\/       \__\/         \__\/                     \__\/         \__\/
//
//
//                         OpenERC165 (supports)
//                             |
//                         OpenERC721 (NFT)
//                             |
//                     ——————————————————————————————————————————————
//                     |                       |                    |
//                OpenERC173          OpenERC721Metadata  OpenERC721Enumerable
//                 (Ownable)                   |                    |
//                     |                       |                    |
//              ————————————————               |                    |
//              |              |               |                    |
//         OpenERC2981     OpenPausable        |                    |
//        (RoyaltyInfo)        |               |                    |
//              |              |               |                    |
//              ————————————————               |                    |
//                     |                       |                    |
//               OpenPriceable                 |                    |
//                     |                       |                    |
//                     ——————————————————————————————————————————————
//                                |
//                            OpenNFTsV4
//

pragma solidity 0.8.9;

import "./OpenPriceable.sol";
import "./OpenERC721Enumerable.sol";
import "./OpenERC721Metadata.sol";
import "./OpenERC173.sol";
import "../interfaces/IOpenNFTsV4.sol";

import "../interfaces/IERC2981.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is IOpenNFTsV4, OpenERC721Metadata, OpenERC721Enumerable, OpenPriceable {
    /// event priceHistory

    /// @notice tokenID of next minted NFT
    uint256 public tokenIdNext = 1;

    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyOpenOrOwner() {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

    /// @notice initialize
    /// @param name_ name of the NFT Collection
    /// @param symbol_ symbol of the NFT Collection
    /// @param owner_ owner of the NFT Collection
    /// @param options select minting open to everyone or only owner
    // solhint-disable-next-line comprehensive-interface
    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        bool[] memory options
    ) external {
        OpenERC721Metadata._initialize(name_, symbol_);
        OpenERC173._initialize(owner_);
        open = options[0];
    }

    function mint(string memory jsonURI)
        external
        override(IOpenNFTsV4)
        onlyOpenOrOwner
        onlyWhenNotPaused
        returns (uint256)
    {
        return _mint(msg.sender, jsonURI);
    }

    function mint(address to, string memory jsonURI) external override(IOpenNFTsV4) onlyOwner returns (uint256) {
        return _mint(to, jsonURI);
    }

    /// @notice burn NFT
    /// @param tokenID tokenID of NFT to burn
    function burn(uint256 tokenID) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _burn(tokenID);
    }

    function withdraw(address to) external override(IOpenNFTsV4) onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    function buy(uint256 tokenID) external payable override(IOpenNFTsV4) {
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

        /// Reset token price (to be eventualy defined by new owner)
        delete tokenPrice[tokenID];

        /// Transfer token
        this.safeTransferFrom(from, msg.sender, tokenID);

        (address receiver, uint256 royalties) = royaltyInfo(tokenID, price);

        assert(price >= royalties);
        uint256 paid = price - royalties;
        uint256 unspent = msg.value - price;
        assert(paid + royalties + unspent == msg.value);

        /// Transfer amount to previous owner
        payable(from).transfer(paid);

        /// Transfer royalties to receiver
        if (royalties > 0) payable(receiver).transfer(royalties);

        /// Transfer back unspent funds to sender
        if (unspent > 0) payable(msg.sender).transfer(unspent);
    }

    /// @notice test if this interface is supported
    /// @param interfaceId interfaceId to test
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(OpenPriceable, OpenERC721Metadata, OpenERC721Enumerable)
        returns (bool)
    {
        return interfaceId == type(IOpenNFTsV4).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @notice _mint
    /// @param minter address of minter
    /// @param jsonURI json URI of NFT metadata
    function _mint(address minter, string memory jsonURI) internal returns (uint256) {
        uint256 tokenID = tokenIdNext;
        tokenIdNext += 1;

        _mintMetadata(tokenID, jsonURI);
        _mintEnumerable(minter, tokenID);
        _mintNft(minter, tokenID);

        return tokenID;
    }

    function _burn(uint256 tokenID) internal {
        _burnNft(tokenID);
        _burnEnumerable(tokenID);
        _burnPriceable(tokenID);
        _burnMetadata(tokenID);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenID) internal view override(OpenERC721) returns (bool) {
        return (spender == address(this)) || super._isApprovedOrOwner(spender, tokenID);
    }
}
