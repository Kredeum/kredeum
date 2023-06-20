// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IOpenBound4973.sol";
import "OpenNFTs/contracts/interfaces/IERC4973.sol";
import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "OpenNFTslibraries/Bafkrey.sol";

/// @title OpenBound smartcontract
contract OpenBound4973 is IOpenBound4973, IERC4973, IERC173, IERC721Enumerable, IERC721Metadata {
    address public owner;

    string public name;
    string public symbol;
    uint256 public totalSupply;

    mapping(uint256 => address) internal _owners;
    mapping(address => uint256[]) internal _tokensOfOwner;
    uint256[] internal _tokens;

    string private constant _BASE_URI = "ipfs://";

    modifier onlyOwner() {
        require((owner == msg.sender), "Not owner");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external override(IERC173) {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function ownerOf(uint256 tokenID) external view override(IERC4973) returns (address nftOwner) {
        nftOwner = _owners[tokenID];
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

    function mint(uint256 tokenID) public override(IOpenBound4973) {
        _mint(msg.sender, tokenID);
    }

    function mint(address addr, uint256 tokenID) public override(IOpenBound4973) onlyOwner {
        _mint(addr, tokenID);
    }

    // function burn(uint256 tokenID) public override(IERC4973) {
    //     require(_exists(tokenID), "NFT does not exists");
    //     totalSupply -= 1;
    //     _owners[tokenID] = address(0);
    //     emit Revoke(address(0), tokenID);
    // }

    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        require(_exists(tokenId), "NFT doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(tokenId)));
    }

    function _mint(address addr, uint256 tokenID) internal {
        require(!_exists(tokenID), "NFT already exists");
        totalSupply += 1;
        _owners[tokenID] = addr;
        _tokens.push(tokenID);
        _tokensOfOwner[addr].push(tokenID);
        emit Attest(addr, tokenID);
    }

    function _exists(uint256 tokenID) internal view returns (bool) {
        return _owners[tokenID] != address(0);
    }
}
