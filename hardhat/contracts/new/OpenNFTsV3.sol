// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "../interfaces/IOpenNFTsV3.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV3 is
    IOpenNFTsV3,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    /// @notice whether minting open to everyone (true) or only owner (false)
    bool public openMinting;

    /// @notice onlyMinter, either evrybody in generic collection,
    /// @notice either only owner in specific collection
    modifier onlyMinter() {
        require(openMinting || (owner() == _msgSender()), "Not minter");
        _;
    }

    /// @notice initialize
    /// @param name_ name of the NFT Collection
    /// @param symbol_ symbol of the NFT Collection
    /// @param owner_ owner of the NFT Collection
    /// @param openMinting_ select minting open to everyone or only owner
    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        bool openMinting_
    ) external override(IOpenNFTsV3) initializer {
        __Ownable_init();
        __ERC721_init(name_, symbol_);
        transferOwnership(owner_);
        openMinting = openMinting_;
    }

    /// @notice mint
    /// @param minter address of minter
    /// @param jsonURI json URI of NFT metadata
    function mintNFT(address minter, string memory jsonURI)
        external
        override(IOpenNFTsV3)
        onlyMinter
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(minter, newItemId);
        _setTokenURI(newItemId, jsonURI);

        return newItemId;
    }

    /// @notice burn NFT
    /// @param tokenId tokenID of NFT to burn
    function burnNFT(uint256 tokenId) external override(IOpenNFTsV3) onlyOwner {
        _burn(tokenId);
    }

    /// @notice Get tokenURI
    /// @param tokenId tokenId of NFT
    /// @param tokenURI_ token URI of NFT
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory tokenURI_)
    {
        tokenURI_ = super.tokenURI(tokenId);
    }

    /// @notice test if this interface is supported
    /// @param interfaceId interfaceId to test
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        // IOpenNFTsV3 => 0xa6123562
        return interfaceId == type(IOpenNFTsV3).interfaceId || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }
}
