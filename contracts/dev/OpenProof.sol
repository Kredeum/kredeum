// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC4973.sol";
import "../interfaces/IOpenProof.sol";

/// @title OpenProof smartcontract
contract OpenProof is
    IOpenProof,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIds;

    event Attest(address indexed to, uint256 indexed tokenId);

    /// @notice onlyMinter, only collection owner can mint
    modifier onlyMinter() {
        require((owner() == _msgSender()), "Not minter");
        _;
    }

    /// @notice initialize
    /// @param name name of the NFT Collection
    /// @param symbol symbol of the NFT Collection
    /// @param owner owner of the NFT Collection
    // solhint-disable-next-line comprehensive-interface
    function initialize(string memory name, string memory symbol, address owner) external initializer {
        __Ownable_init();
        __ERC721_init(name, symbol);
        transferOwnership(owner);
    }

    /// @notice mint
    /// @param to address that will own the NFT minted
    /// @param jsonURI json URI of NFT metadata
    function mintOpenProof(address to, string memory jsonURI)
        external
        override (IOpenProof)
        onlyMinter
        returns (uint256 tokenId)
    {
        _tokenIds.increment();

        tokenId = _tokenIds.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, jsonURI);
    }

    /// @notice Get tokenURI
    /// @param tokenId tokenId of NFT
    /// @param tokenURI_ token URI of NFT
    function tokenURI(uint256 tokenId)
        public
        view
        override (ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory tokenURI_)
    {
        tokenURI_ = super.tokenURI(tokenId);
    }

    /// @notice test if this interface is supported
    /// @param interfaceId interfaceId to test
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override (ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return interfaceId == type(IERC173).interfaceId || interfaceId == type(IERC4973).interfaceId
            || super.supportsInterface(interfaceId);
    }

    function _afterTokenTransfer(
        address, // from,
        address to,
        uint256 tokenId
    ) internal override (ERC721Upgradeable) {
        emit Attest(to, tokenId);
    }

    function _burn(uint256 tokenId) internal override (ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address, // to,
        uint256 // tokenId
    ) internal pure override (ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        require(from == address(0), "Non transferable NFT");
    }
}
