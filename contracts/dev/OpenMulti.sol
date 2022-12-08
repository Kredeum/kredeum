// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTslibraries/Bafkrey.sol";
import "../interfaces/IOpenMulti.sol";

contract OpenMulti is IOpenMulti, ERC721, ERC721Enumerable, Ownable {
    bytes32 private constant _BASE32_SYMBOLS = "abcdefghijklmnopqrstuvwxyz234567";

    string private constant _BASE_URI = "https://ipfs.io/ipfs/";

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function claim(uint256 tokenId) public override (IOpenMulti) {
        _safeMint(msg.sender, tokenId);
    }

    function exists(uint256 tokenId) public view override (IOpenMulti) returns (bool) {
        return _exists(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override (ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721: token doesn't exists");

        return string(abi.encodePacked(_BASE_URI, Bafkrey.uint256ToCid(tokenId)));
    }

    function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool) {
        return interfaceId == type(IOpenMulti).interfaceId || interfaceId == type(IERC173).interfaceId
            || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override (ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
