// SPDX-License-Identifier: MIT
//
//       ___           ___           ___          _____          ___           ___           ___
//      /__/|         /  /\         /  /\        /  /::\        /  /\         /__/\         /__/\
//     |  |:|        /  /::\       /  /:/_      /  /:/\:\      /  /:/_        \  \:\       |  |::\
//     |  |:|       /  /:/\:\     /  /:/ /\    /  /:/  \:\    /  /:/ /\        \  \:\      |  |:|:\
//   __|  |:|      /  /:/~/:/    /  /:/ /:/_  /__/:/ \__\:|  /  /:/ /:/_   ___  \  \:\   __|__|:|\:\
//  /__/\_|:|____ /__/:/ /:/___ /__/:/ /:/ /\ \  \:\ /  /:/ /__/:/ /:/ /\ /__/\  \__\:\ /__/::::| \:\
//  \  \:\/:::::/ \  \:\/:::::/ \  \:\/:/ /:/  \  \:\  /:/  \  \:\/:/ /:/ \  \:\ /  /:/ \  \:\~~\__\/
//   \  \::/~~~~   \  \::/~~~~   \  \::/ /:/    \  \:\/:/    \  \::/ /:/   \  \:\  /:/   \  \:\
//    \  \:\        \  \:\        \  \:\/:/      \  \::/      \  \:\/:/     \  \:\/:/     \  \:\
//     \  \:\        \  \:\        \  \::/        \__\/        \  \::/       \  \::/       \  \:\
//      \__\/         \__\/         \__\/                       \__\/         \__\/         \__\/
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
//                         OpenERC165 (supports)
//                             |
//                             ————————————————————————————————————————————————————
//                             |                                                  |
//                         OpenERC721 (NFT)                                 OpenCloneable
//                             |                                                  |
//                     ——————————————————————————————————————————————             |
//                     |                       |                    |             |
//                OpenERC173          OpenERC721Metadata  OpenERC721Enumerable    |
//                 (Ownable)                   |                    |             |
//                     |                       |                    |             |
//              ————————————————               |                    |             |
//              |              |               |                    |             |
//         OpenERC2981   OpenPauseable         |                    |             |
//        (RoyaltyInfo)        |               |                    |             |
//              |              |               |                    |             |
//              ————————————————               |                    |             |
//                     |                       |                    |             |
//               OpenMarketable                |                    |             |
//                     |                       |                    |             |
//                     ———————————————————————————————————————————————————————————|
//                              |                                                  |
//                         OpenNFTsV4 --- IOpenNFTsV4
//

pragma solidity 0.8.9;

import "../open/OpenCloneable.sol";
import "../open/OpenMarketable.sol";
import "../open/OpenERC721Enumerable.sol";
import "../open/OpenERC721Metadata.sol";

import "../interfaces/IOpenNFTs.sol";
import "../interfaces/IOpenNFTsV4.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IERC2981.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is IOpenNFTsV4, OpenCloneable, OpenERC721Enumerable, OpenERC721Metadata, OpenMarketable {
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
    ) public {
        OpenCloneable._initialize("OpenNFTs", 4);

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
    function burn(uint256 tokenID) external override(IOpenNFTsV4) onlyTokenOwnerOrApproved(tokenID) {
        _burn(tokenID);
    }

    function withdraw(address to) external override(IOpenNFTsV4) onlyOwner {
        require(to != address(0), "Don't throw your money !");
        payable(to).transfer(address(this).balance);
    }

    function withdrawErc20(address token) external override(IOpenNFTsV4) onlyOwner {
        require(IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this))), "Withdraw failed");
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
        override(OpenMarketable, OpenERC721Metadata, OpenERC721Enumerable, OpenCloneable)
        returns (bool)
    {
        return
            interfaceId == type(IOpenNFTs).interfaceId ||
            interfaceId == type(IOpenNFTsV4).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice _mint
    /// @param minter address of minter
    /// @param jsonURI json URI of NFT metadata
    function _mint(address minter, string memory jsonURI) internal returns (uint256 tokenID) {
        tokenID = tokenIdNext++;

        _mintMetadata(tokenID, jsonURI);
        _mintEnumerable(minter, tokenID);
        _mintNft(minter, tokenID);
    }

    function _burn(uint256 tokenID) internal {
        _burnPriceable(tokenID);
        _burnMetadata(tokenID);
        _burnEnumerable(tokenID);
        _burnNft(tokenID);
    }

    function _transferFromBefore(
        address from,
        address to,
        uint256 tokenID
    ) internal override(OpenERC721, OpenERC721Enumerable) {
        OpenERC721Enumerable._transferFromBefore(from, to, tokenID);
    }
}
