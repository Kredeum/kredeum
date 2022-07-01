// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";

import "./interfaces/IOpenNFTsV4.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/IERC2981.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is
    IOpenNFTsV4,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC2981Upgradeable
{
    /// event priceHistory

    /// Collection owner
    address public owner;

    /// @notice tokenID of next minted NFT
    uint256 public tokenIdNext = 1;

    mapping(uint256 => uint256) public tokenPrice;
    uint256 public floorPrice;

    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOwner, only collection owner
    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyOpenOrOwner() {
        require(open || (owner == msg.sender), "Not minter");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenID) {
        require(ownerOf(tokenID) == msg.sender, "Not token owner");
        _;
    }

    /// @notice initialize
    /// @param name name of the NFT Collection
    /// @param symbol symbol of the NFT Collection
    /// @param firstOwner owner of the NFT Collection
    /// @param options select minting open to everyone or only owner
    // solhint-disable-next-line comprehensive-interface
    function initialize(
        string memory name,
        string memory symbol,
        address firstOwner,
        bool[] memory options
    ) external initializer {
        __ERC721_init(name, symbol);
        owner = firstOwner;
        open = options[0];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
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
    /// @param receiver : address of the royalty receiver
    /// @param feeNumerator : fee Numerator, over 10000
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external override(IOpenNFTsV4) onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
        emit SetRoyalty(receiver, feeNumerator);
    }

    /// @notice SET token royalty configuration
    /// @param tokenID : token ID
    /// @param receiver : address of the royalty receiver
    /// @param feeNumerator : fee Numerator, over 10000
    function setTokenRoyalty(
        uint256 tokenID,
        address receiver,
        uint96 feeNumerator
    ) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _setTokenRoyalty(tokenID, receiver, feeNumerator);
        emit SetTokenRoyalty(tokenID, receiver, feeNumerator);
    }

    function setTokenPrice(uint256 tokenID, uint256 price) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        tokenPrice[tokenID] = price;
    }

    /// @notice RESET token royalty configuration
    /// @param tokenID : token ID
    function resetRoyalty(uint256 tokenID) external override(IOpenNFTsV4) onlyTokenOwner(tokenID) {
        _resetTokenRoyalty(tokenID);
        emit SetTokenRoyalty(tokenID, address(0), 0);
    }

    /// @notice DELETE default royalty configuration
    function resetDefaultRoyalty() external override(IOpenNFTsV4) onlyOpenOrOwner {
        _deleteDefaultRoyalty();
        emit SetRoyalty(address(0), 0);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenID
    ) public override(ERC721Upgradeable) {
        super.safeTransferFrom(from, to, tokenID, "");
    }

    /// @notice Get tokenURI
    /// @param tokenID tokenID of NFT
    /// @param tokenURI_ token URI of NFT
    function tokenURI(uint256 tokenID)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory tokenURI_)
    {
        tokenURI_ = super.tokenURI(tokenID);
    }

    /// @notice test if this interface is supported
    /// @param interfaceId interfaceId to test
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IOpenNFTsV4).interfaceId ||
            interfaceId == type(IERC173).interfaceId ||
            // interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
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

    function _burn(uint256 tokenID) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        delete tokenPrice[tokenID];
        ERC721URIStorageUpgradeable._burn(tokenID);
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
