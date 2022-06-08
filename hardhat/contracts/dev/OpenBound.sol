// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IOpenBound.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/IERC721Enumerable.sol";
import "./library/Bafkrey.sol";

/// @title OpenBound smartcontract
// contract OpenBound is ERC721, IOpenBound, IERC173, IERC721Enumerable, IERC721Metadata {
contract OpenBound is ERC721, IOpenBound, IERC173, IERC721Enumerable {
    address public owner;

    uint256 public totalSupply;

    mapping(address => uint256[]) internal _tokensOfOwner;
    uint256[] internal _tokens;

    string private constant _BASE_URI = "ipfs://";

    modifier onlyOwner() {
        require((owner == msg.sender), "Not owner");
        _;
    }

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external override(IERC173) {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function tokenByIndex(uint256 index) external view override(IERC721Enumerable) returns (uint256 tokenID) {
        require(index < _tokens.length, "Invalid index");
        tokenID = _tokens[index];
        // require(_exists(tokenID), "NFT doesn't exists");
    }

    function tokenOfOwnerByIndex(address addr, uint256 index)
        external
        view
        override(IERC721Enumerable)
        returns (uint256 tokenID)
    {
        require(index < _tokens.length, "Invalid index");
        tokenID = _tokensOfOwner[addr][index];
        // require(_exists(tokenID), "NFT doesn't exists");
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return
            interfaceId == type(IOpenBound).interfaceId ||
            interfaceId == type(IERC173).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function mint(uint256 tokenID) public override(IOpenBound) {
        mint(msg.sender, tokenID);
    }

    function mint(address addr, uint256 tokenID) public override(IOpenBound) onlyOwner {
        totalSupply += 1;
        _tokens.push(tokenID);
        _tokensOfOwner[addr].push(tokenID);
        _mint(addr, tokenID);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "NFT doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(tokenId)));
    }
}
