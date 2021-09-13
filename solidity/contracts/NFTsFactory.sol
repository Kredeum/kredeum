// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract NFTsFactory is CloneFactory {
  using ERC165Checker for address;
  bytes4 private ERC721 = 0x80ac58cd;
  bytes4 private ERC721Metadata = 0x5b5e139f;

  struct NftData {
    uint256 balance;
    string name;
    string symbol;
    address nft;
  }

  // bytes4 private ERC721Enumerable = 0x780e9d63;

  function balanceOf(address nft, address owner) public view returns (NftData memory nftData) {
    if (nft.supportsInterface(ERC721)) {
      nftData.nft = nft;
      nftData.balance = IERC721(nft).balanceOf(owner);
      if (nft.supportsInterface(ERC721Metadata)) {
        nftData.name = IERC721Metadata(nft).name();
        nftData.symbol = IERC721Metadata(nft).symbol();
      }
    }
  }

  function balancesOf(address owner) external view returns (NftData[] memory nftData) {
    nftData = new NftData[](_implementations.length);
    for (uint256 i = 0; i < _implementations.length; i += 1) {
      nftData[i] = balanceOf(_implementations[i], owner);
    }
  }
}
