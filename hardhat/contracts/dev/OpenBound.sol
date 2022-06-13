// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IOpenBound.sol";
import "../interfaces/IERC721Enumerable.sol";
import "./library/Bafkrey.sol";

/// @title OpenBound smartcontract
// contract OpenBound is ERC721, IOpenBound, IERC173, IERC721Enumerable, IERC721Metadata {
contract OpenBound is ERC721, IOpenBound, IERC721Enumerable {
    uint256 public constant maxSupply = 42;

    uint256 internal _block;

    mapping(address => uint256) internal _tokenOfOwner;
    mapping(address => uint256) internal _tokenIndexOfOwner;
    uint256[] internal _tokens;

    string private constant _BASE_URI = "ipfs://";

    constructor(
        string memory name,
        string memory symbol,
        uint256 block_
    ) ERC721(name, symbol) {
        _block = block_;
    }

    function tokenByIndex(uint256 index) external view override(IERC721Enumerable) returns (uint256 tokenID) {
        require(index < _tokens.length, "Invalid index");
        tokenID = _tokens[index];
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

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return
            interfaceId == type(IOpenBound).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function mint(uint256 tokenID) public override(IOpenBound) {
        require(block.number >= _block, "Not allowed yet");
        require(totalSupply() < maxSupply, "Max supply reached");
        require(balanceOf(msg.sender) == 0, "Already minted or claimed");

        _tokens.push(tokenID);
        _tokenOfOwner[msg.sender] = tokenID;
        _tokenIndexOfOwner[msg.sender] = _tokens.length - 1;
        _mint(msg.sender, tokenID);
    }

    function burn(uint256 tokenID) public override(IOpenBound) {
        address owner = ownerOf(tokenID);
        require(owner == msg.sender, "Not owner");

        _burn(tokenID);
        _tokens[_tokenIndexOfOwner[owner]] = _tokens[_tokens.length - 1];
        _tokens.pop();
        _tokenOfOwner[owner] = 0;
        _tokenIndexOfOwner[owner] = 0;
    }

    function totalSupply() public view override(IERC721Enumerable) returns (uint256) {
        return _tokens.length;
    }

    function tokenURI(uint256 tokenID) public view override(ERC721) returns (string memory) {
        require(_exists(tokenID), "NFT doesn't exists");

        uint256 cid = _ownerXorId(ownerOf(tokenID), tokenID);
        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(cid)));
    }

    function _ownerXorId(address owner, uint256 id) internal pure returns (uint256) {
        return uint160(owner) ^ id;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 // tokenId
    ) internal pure override(ERC721) {
        require(from == address(0) || to == address(0), "Non transferable NFT");
    }
}
