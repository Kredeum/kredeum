// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftPass is ERC721, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  string private _tokenURI;
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("NFT Pass", "PASS") {}

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
    require(_exists(tokenId), "Nonexistent token");
    return _tokenURI;
  }

  function _burn(uint256 tokenId) internal override(ERC721) {
    super._burn(tokenId);
  }

  function setTokenURI(string memory tokenURI_) public onlyOwner {
    _tokenURI = tokenURI_;
  }
}
