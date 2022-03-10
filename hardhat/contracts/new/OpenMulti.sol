// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IOpenMulti.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract OpenMulti is IOpenMulti, ERC721, ERC721Enumerable {
    bytes32 private constant BASE32_SYMBOLS = "abcdefghijklmnopqrstuvwxyz234567";

    string private constant BASE_URI = "https://ipfs.io/ipfs/";

    constructor() ERC721("OpenMulti", "MULTI") {}

    function claim(uint256 tokenId) public override(IOpenMulti) {
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721: token doesn't exists");

        // IPFS CID V1 base32 raw => 5 bits => uint32
        // uint256 tokenId  = 256 bits = 1 bit + 51 uint32 = 1 + 51 * 5 = 256
        // 00 added right =>
        // uint8 + uint256 + 00 = 258 bits = uint8 + 50 uint32 + (3 bits + 00) = uint8 + 51 uint32 = 3 + 51 * 5 = 258

        bytes memory buffer = new bytes(52);

        uint8 high3 = uint8(tokenId >> 253);
        buffer[0] = BASE32_SYMBOLS[high3 & 0x1f];

        tokenId <<= 2;
        for (uint256 i = 51; i > 0; i--) {
            buffer[i] = BASE32_SYMBOLS[tokenId & 0x1f];
            tokenId >>= 5;
        }

        return string(abi.encodePacked(BASE_URI, "bafkrei", buffer));
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
