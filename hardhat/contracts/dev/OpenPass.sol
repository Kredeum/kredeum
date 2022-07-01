// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IOpenPass.sol";

contract OpenPass is ERC721, IOpenPass, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    string private _tokenURI;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("NFT Pass", "PASS") {}

    function safeMint(address to) public override(IOpenPass) onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setTokenURI(string memory tokenURI_) public override(IOpenPass) onlyOwner {
        _tokenURI = tokenURI_;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        return _tokenURI;
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
