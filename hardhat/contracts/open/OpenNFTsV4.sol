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
//
//
// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

import "./OpenPrice.sol";
import "./OpenOwnable.sol";
import "./OpenERC165.sol";
import "./OpenERC2981.sol";
import "./OpenERC721Metadata.sol";
import "../interfaces/IOpenNFTsV4.sol";

import "../interfaces/IERC2981.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is
    OpenERC165,
    OpenERC2981,
    OpenPrice,
    OpenOwnable,
    OpenERC721Metadata,
    IOpenNFTsV4,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable
{
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

    modifier onlyTokenOwner(uint256 tokenID) {
        require(ownerOf(tokenID) == msg.sender, "Not token owner");
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
    ) external initializer {
        _setName(name_);
        _setSymbol(symbol_);
        _setOwner(owner_);
        open = options[0];
    }

    function mint(string memory jsonURI) external override(IOpenNFTsV4) onlyOpenOrOwner returns (uint256) {
        return _mint(msg.sender, jsonURI);
    }

    function mintFor(address to, string memory jsonURI) external override(IOpenNFTsV4) onlyOwner returns (uint256) {
        return _mint(to, jsonURI);
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

    /// @notice burn NFT
    /// @param tokenID tokenID of NFT to burn
    function burn(uint256 tokenID) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _burn(tokenID);
    }

    function withdraw(address to) external override(IOpenNFTsV4) onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    /// @notice SET default royalty configuration
    /// @param receiver : address of the royalty receiver, or address(0) to reset
    /// @param feeNumerator : fee Numerator, less than 10000
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external override(IOpenNFTsV4) onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
        emit SetRoyalty(receiver, feeNumerator);
    }

    /// @notice SET token royalty configuration
    /// @param tokenID : token ID
    /// @param receiver : address of the royalty receiver, or address(0) to reset
    /// @param feeNumerator : fee Numerator, less than 10000
    function setTokenRoyalty(
        uint256 tokenID,
        address receiver,
        uint96 feeNumerator
    ) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _setTokenRoyalty(tokenID, receiver, feeNumerator);
        emit SetTokenRoyalty(tokenID, receiver, feeNumerator);
    }

    function setTokenPrice(uint256 tokenID, uint256 price) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _setTokenPrice(tokenID, price);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenID
    ) public override(ERC721Upgradeable) {
        super.safeTransferFrom(from, to, tokenID, "");
    }

    /// @notice test if this interface is supported
    /// @param interfaceId interfaceId to test
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            OpenERC165,
            OpenERC2981,
            OpenOwnable,
            OpenERC721Metadata,
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable
        )
        returns (bool)
    {
        return
            OpenERC165.supportsInterface(interfaceId) ||
            OpenERC2981.supportsInterface(interfaceId) ||
            OpenOwnable.supportsInterface(interfaceId) ||
            OpenERC721Metadata.supportsInterface(interfaceId) ||
            ERC721Upgradeable.supportsInterface(interfaceId) ||
            ERC721EnumerableUpgradeable.supportsInterface(interfaceId) ||
            interfaceId == type(IOpenNFTsV4).interfaceId;
    }

    /// @notice _mint
    /// @param minter address of minter
    /// @param jsonURI json URI of NFT metadata
    function _mint(address minter, string memory jsonURI) internal returns (uint256) {
        uint256 tokenID = tokenIdNext;
        tokenIdNext += 1;

        _safeMint(minter, tokenID);
        _setTokenURI(tokenID, jsonURI);

        return tokenID;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenID
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        ERC721EnumerableUpgradeable._beforeTokenTransfer(from, to, tokenID);
    }

    function _burn(uint256 tokenID) internal override(OpenERC721Metadata, ERC721Upgradeable) {
        delete tokenPrice[tokenID];
        ERC721Upgradeable._burn(tokenID);
        OpenERC721Metadata._burn(tokenID);
    }

    function name() public view override(ERC721Upgradeable, OpenERC721Metadata) returns (string memory) {
        return OpenERC721Metadata.name();
    }

    function symbol() public view override(ERC721Upgradeable, OpenERC721Metadata) returns (string memory) {
        return OpenERC721Metadata.symbol();
    }

    function tokenURI(uint256 tokenID)
        public
        view
        override(ERC721Upgradeable, OpenERC721Metadata)
        returns (string memory)
    {
        return OpenERC721Metadata.tokenURI(tokenID);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenID)
        internal
        view
        override(ERC721Upgradeable)
        returns (bool)
    {
        return (spender == address(this)) || super._isApprovedOrOwner(spender, tokenID);
    }
}
