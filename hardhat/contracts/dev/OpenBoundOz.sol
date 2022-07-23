// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IOpenBoundOz.sol";
import "../interfaces/IOpenPausable.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC173.sol";
import "../library/Bafkrey.sol";

/// @title OpenBound smartcontract
// contract OpenBound is ERC721, IOpenBoundOz, IERC173, IERC721Enumerable, IERC721Metadata {
contract OpenBoundOz is ERC721, IOpenBoundOz, IERC721Enumerable, IOpenPausable, Ownable {
    uint256 public maxSupply;

    bool public paused;

    mapping(address => uint256) internal _tokenOfOwner;
    mapping(address => uint256) internal _tokenIndexOfOwner;
    mapping(uint256 => uint256) internal _cidOfToken;
    uint256[] internal _tokens;

    string private constant _BASE_URI = "ipfs://";

    modifier whenNotPaused() {
        require(!paused, "Paused !");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply_
    ) ERC721(name, symbol) {
        maxSupply = maxSupply_;
    }

    function togglePause() external override(IOpenPausable) onlyOwner {
        paused = !paused;
        emit SetPaused(paused, msg.sender);
    }

    function burn(uint256 tokenID) external override(IOpenBoundOz) {
        address owner = ownerOf(tokenID);
        require(owner == msg.sender, "Not owner");

        uint256 index = _tokenIndexOfOwner[owner];
        uint256 lastIndex = _tokens.length - 1;

        _burn(tokenID);

        if (index != lastIndex) {
            _tokens[index] = _tokens[lastIndex];
            _tokenIndexOfOwner[ownerOf(_tokens[lastIndex])] = index;
        }
        _tokens.pop();

        delete _cidOfToken[tokenID];
        delete _tokenIndexOfOwner[owner];
        delete _tokenOfOwner[owner];
    }

    function tokenByIndex(uint256 index) external view override(IERC721Enumerable) returns (uint256) {
        require(index < _tokens.length, "Invalid index");

        return _tokens[index];
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

    function mint(uint256 cid) public override(IOpenBoundOz) whenNotPaused returns (uint256) {
        require((maxSupply == 0) || totalSupply() < maxSupply, "Max supply reached");
        require(balanceOf(msg.sender) == 0, "Already minted or claimed");

        uint256 tokenID = getMyTokenID(cid);

        _tokens.push(tokenID);
        _tokenOfOwner[msg.sender] = tokenID;
        _tokenIndexOfOwner[msg.sender] = _tokens.length - 1;
        _cidOfToken[tokenID] = cid;

        _mint(msg.sender, tokenID);

        return tokenID;
    }

    function claim(uint256 tokenID, uint256 cid) public override(IOpenBoundOz) whenNotPaused {
        require(tokenID == getMyTokenID(cid), "Not owner");
        mint(cid);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return
            interfaceId == type(IOpenBoundOz).interfaceId ||
            interfaceId == type(IOpenPausable).interfaceId ||
            interfaceId == type(IERC173).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function getMyTokenID(uint256 cid) public view override(IOpenBoundOz) returns (uint256) {
        return getTokenID(cid, msg.sender);
    }

    function getCID(uint256 tokenID) public view override(IOpenBoundOz) returns (uint256) {
        return _cidOfToken[tokenID];
    }

    function totalSupply() public view override(IERC721Enumerable) returns (uint256) {
        return _tokens.length;
    }

    function tokenURI(uint256 tokenID) public view override(ERC721) returns (string memory) {
        require(_exists(tokenID), "NFT doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(getCID(tokenID))));
    }

    function getTokenID(uint256 cid, address addr) public pure override(IOpenBoundOz) returns (uint256) {
        return _tokenID(cid, addr);
    }

    function _tokenID(uint256 cid, address addr) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(cid, addr)));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 // tokenId
    ) internal pure override(ERC721) {
        require(from == address(0) || to == address(0), "Non transferable NFT");
    }
}
