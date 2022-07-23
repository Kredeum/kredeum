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
//                        OpenERC173
//                         (Ownable)
//                             |
//                        OpenPausable
//                             |
//                         OpenBound --- IOpenBound --- IERC721Enumerable --- IERC721Metadata
//

pragma solidity ^0.8.9;

import "./OpenPausable.sol";
import "../interfaces/IOpenBound.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC721Metadata.sol";
import "../library/Bafkrey.sol";

/// @title OpenBound smartcontract
contract OpenBound is IOpenBound, IERC721Enumerable, IERC721Metadata, OpenPausable {
    uint256 public maxSupply;

    bool private _once;
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
        require(_once == false, "Only once!");
        _once = true;

        name = name_;
        symbol = symbol_;
        maxSupply = maxSupply_;

        OpenERC173._initialize(owner_);
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

    function getCID(uint256 tokenID) external view override(IOpenBound) returns (uint256 CID) {
        CID = _cidOfToken[tokenID];
    }

    /// IERC721Enumerable
    function totalSupply() external view override(IERC721Enumerable) returns (uint256) {
        return _tokens.length;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        override(IERC721Enumerable)
        returns (uint256)
    {
        require(index == 0 && balanceOf(owner) == 1, "Invalid index");

        return _tokenOfOwner[owner];
    }

    function tokenByIndex(uint256 index) external view override(IERC721Enumerable) returns (uint256) {
        require(index < _tokens.length, "Invalid index");

        return _tokens[index];
    }

    /// IERC721Metadata
    function tokenURI(uint256 tokenID) external view override(IERC721Metadata) returns (string memory) {
        require(_exists(tokenID), "NFT doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(_cidOfToken[tokenID])));
    }

    /// IERC165
    function supportsInterface(bytes4 interfaceId) public view override(OpenPausable) returns (bool) {
        return
            interfaceId == type(IOpenBound).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// internal
    function _tokenID(address addr, uint256 cid) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(cid, addr)));
    }

    function _mintEnumerable(
        address to,
        uint256 tokenID,
        uint256 cid
    ) internal {
        _tokens.push(tokenID);
        _tokenOfOwner[to] = tokenID;
        _tokenIndexOfOwner[to] = _tokens.length - 1;
        _cidOfToken[tokenID] = cid;
    }

    function _mint(address to, uint256 cid) internal returns (uint256) {
        require((maxSupply == 0) || _tokens.length < maxSupply, "Max supply reached");
        require(balanceOf(to) == 0, "Already minted or claimed");

        uint256 tokenID = _tokenID(to, cid);

        _mintNft(to, tokenID);
        _mintEnumerable(to, tokenID, cid);

        return tokenID;
    }

    function _burnEnumerable(uint256 tokenID) internal {
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
    }

    function _burn(uint256 tokenID) internal {
        _burnEnumerable(tokenID);
        _burnNft(tokenID);
    }

    function _transferFromBefore(
        address from,
        address to,
        uint256 // tokenId
    ) internal pure override {
        require(from == address(0) || to == address(0), "Non transferable NFT");
    }
}
