// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IERC173.sol";
import "./interfaces/IERC4973.sol";
import "./interfaces/IERC721Enumerable.sol";
import "./interfaces/IERC721Metadata.sol";
import "./interfaces/IOpenBound.sol";
import "./library/Bafkrey.sol";

/// @title OpenBound smartcontract
contract OpenBound is IOpenBound, IERC4973, IERC721Enumerable, IERC721Metadata, IERC173 {
    address public owner;

    string public name;
    string public symbol;
    uint256 public totalSupply;

    mapping(uint256 => address) _owners;
    mapping(address => uint256[]) _tokensOfOwner;
    uint256[] _tokens;

    string private _BASE_URI = "ipfs://";

    modifier onlyOwner() {
        require((owner == msg.sender), "Not owner");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }

    function mint(address addr, uint256 tokenID) public onlyOwner {
        _mint(addr, tokenID);
    }

    function mint(uint256 tokenID) public {
        _mint(msg.sender, tokenID);
    }

    function _mint(address addr, uint256 tokenID) internal {
        require(!_exists(tokenID), "NFT already exists");
        totalSupply += 1;
        _owners[tokenID] = addr;
        _tokens.push(tokenID);
        _tokensOfOwner[addr].push(tokenID);
    }

    function ownerOf(uint256 tokenID) external view returns (address nftOwner) {
        nftOwner = _owners[tokenID];
    }

    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        require(_exists(tokenId), "ERC721: token doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(tokenId)));
    }

    function tokenByIndex(uint256 index) external view returns (uint256) {
        return _tokens[index];
    }

    function tokenOfOwnerByIndex(address addr, uint256 index) external view returns (uint256) {
        return _tokensOfOwner[addr][index];
    }

    function _exists(uint256 tokenID) internal view returns (bool) {
        return _owners[tokenID] != address(0);
    }

    function transferOwnership(address newOwner) external {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
