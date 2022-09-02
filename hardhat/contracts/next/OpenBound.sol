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
//  OpenERC165 (supports)
//      |
//      ———————————————————————————————————————————————
//      |                 |             |             |
//  OpenERC721 (NFT)  OpenERC173  OpenChecker  OpenCloneable
//      |             (ownable)         |             |
//      |                 |             |             |
//      |                 |             |             |
//      |            OpenPauseable      |             |
//      |                 |             |             |
//      ———————————————————————————————————————————————
//      |
//  OpenBound --- IOpenBound --- IERC721Enumerable --- IERC721Metadata
//
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/OpenERC/OpenERC721.sol";
import "OpenNFTs/contracts/OpenNFTs/OpenPauseable.sol";
import "OpenNFTs/contracts/OpenNFTs/OpenCloneable.sol";
import "OpenNFTs/contracts/OpenResolver/OpenChecker.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "OpenNFTs/contracts/libraries/Bafkrey.sol";

import "../interfaces/IOpenBound.sol";
import {IOpenNFTs as IOpenNFTsOld} from "../interfaces/IOpenNFTs.old.sol";

/// @title OpenBound smartcontract
/// limited to one nft per address
contract OpenBound is
    IOpenBound,
    IERC721Enumerable,
    IERC721Metadata,
    OpenCloneable,
    OpenChecker,
    OpenPauseable,
    OpenERC721
{
    uint256 public maxSupply;

    string public name;
    string public symbol;

    mapping(address => uint256) internal _tokenOfOwner;
    mapping(address => uint256) internal _tokenIndexOfOwner;
    mapping(uint256 => uint256) internal _cidOfToken;
    uint256[] internal _tokens;

    string private constant _BASE_URI = "ipfs://";

    /// IOpenBound
    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        uint256 maxSupply_
    ) external override(IOpenBound) {
        OpenCloneable._initialize("OpenBound", 1);
        OpenERC173._initialize(owner_);

        name = name_;
        symbol = symbol_;
        maxSupply = maxSupply_;
    }

    function mint(uint256 cid) external override(IOpenBound) onlyWhenNotPaused returns (uint256 tokenID) {
        tokenID = _mint(msg.sender, cid);
    }

    function claim(uint256 tokenID, uint256 cid) external override(IOpenBound) onlyWhenNotPaused {
        require(tokenID == _tokenID(msg.sender, cid), "Not owner");
        _mint(msg.sender, cid);
    }

    function burn(uint256 tokenID) external override(IOpenBound) {
        address from = ownerOf(tokenID);
        require(from == msg.sender, "Not owner");

        _burn(tokenID);
    }

    function getMyTokenID(uint256 cid) external view override(IOpenBound) returns (uint256 myTokenID) {
        myTokenID = _tokenID(msg.sender, cid);
    }

    function getCID(uint256 tokenID) external view override(IOpenBound) returns (uint256 cid) {
        cid = _cidOfToken[tokenID];
    }

    /// IERC721Enumerable
    function totalSupply() external view override(IERC721Enumerable) returns (uint256 tokensLength) {
        tokensLength = _tokens.length;
    }

    function tokenOfOwnerByIndex(address tokenOwner, uint256 index)
        external
        view
        override(IERC721Enumerable)
        returns (uint256 tokenID)
    {
        require(index == 0 && balanceOf(tokenOwner) == 1, "Invalid index");

        tokenID = _tokenOfOwner[tokenOwner];
    }

    function tokenByIndex(uint256 index) external view override(IERC721Enumerable) returns (uint256 tokenID) {
        require(index < _tokens.length, "Invalid index");

        tokenID = _tokens[index];
    }

    /// IERC721Metadata
    function tokenURI(uint256 tokenID)
        external
        view
        override(IERC721Metadata)
        existsToken(tokenID)
        returns (string memory)
    {
        return _tokenURI(_cidOfToken[tokenID]);
    }

    function getTokenID(address addr, uint256 cid) external pure override(IOpenBound) returns (uint256 tokenID) {
        tokenID = _tokenID(addr, cid);
    }

    /// IERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(OpenPauseable, OpenCloneable, OpenERC721, OpenChecker)
        returns (bool)
    {
        return
            interfaceId == type(IOpenBound).interfaceId ||
            interfaceId == type(IOpenNFTsOld).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _mint(address to, uint256 cid) internal returns (uint256 tokenID) {
        require((maxSupply == 0) || _tokens.length < maxSupply, "Max supply reached");
        require(balanceOf(to) == 0, "Already minted or claimed");

        tokenID = _tokenID(to, cid);

        _tokens.push(tokenID);
        _tokenOfOwner[to] = tokenID;
        _tokenIndexOfOwner[to] = _tokens.length - 1;
        _cidOfToken[tokenID] = cid;

        _mint(to, _tokenURI(cid), tokenID);
    }

    function _mint(
        address to,
        string memory newTokenURI,
        uint256 tokenID
    ) internal override(OpenERC721) {
        super._mint(to, newTokenURI, tokenID);
    }

    function _burn(uint256 tokenID) internal override(OpenERC721) {
        address from = ownerOf(tokenID);
        uint256 index = _tokenIndexOfOwner[from];
        uint256 lastIndex = _tokens.length - 1;

        if (index != lastIndex) {
            _tokens[index] = _tokens[lastIndex];
            _tokenIndexOfOwner[ownerOf(_tokens[lastIndex])] = index;
        }
        _tokens.pop();

        delete _cidOfToken[tokenID];
        delete _tokenIndexOfOwner[from];
        delete _tokenOfOwner[from];

        super._burn(tokenID);
    }

    function _tokenID(address addr, uint256 cid) internal pure returns (uint256 tokenID) {
        tokenID = uint256(keccak256(abi.encodePacked(cid, addr)));
    }

    function _tokenURI(uint256 cid) internal pure returns (string memory) {
        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(cid)));
    }

    function _transferFromBefore(
        address from,
        address to,
        uint256 // tokenId
    ) internal pure override {
        require(from == address(0) || to == address(0), "Non transferable NFT");
    }
}
