// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "./interfaces/IOpenNFTs.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract NFTsFactory is CloneFactory {
  using ERC165Checker for address;

  uint8 constant ERC721 = 0;
  uint8 constant ERC721Metadata = 1;
  uint8 constant ERC721Enumerable = 2;
  uint8 constant OpenNFTs = 3;

  bytes4 constant ERC721Sig = bytes4(0x80ac58cd);
  bytes4 constant ERC721MetadataSig = bytes4(0x780e9d63);
  bytes4 constant ERC721EnumerableSig = bytes4(0x780e9d63);
  bytes4 constant OpenNFTsSig = type(IOpenNFTs).interfaceId;

  struct NftData {
    address nft;
    string name;
    string symbol;
    uint256 balance;
    address owner;
  }

  function balanceOf(address nft, address owner) public view returns (NftData memory nftData) {
    bytes4[] memory iface = new bytes4[](4);
    iface[ERC721] = ERC721Sig;
    iface[ERC721Metadata] = ERC721MetadataSig;
    iface[ERC721Enumerable] = ERC721EnumerableSig;
    iface[OpenNFTs] = OpenNFTsSig;
    bool[] memory supportInterface = nft.getSupportedInterfaces(iface);

    // ERC721
    if (supportInterface[ERC721]) {
      nftData.nft = nft;

      // ERC721Metadata
      if (supportInterface[1]) {
        nftData.name = IERC721Metadata(nft).name();
        nftData.symbol = IERC721Metadata(nft).symbol();
      }

      if (owner == address(0)) {
        // ERC721Enumerable
        if (supportInterface[2]) {
          nftData.balance = IERC721Enumerable(nft).totalSupply();
        }
      } else {
        nftData.balance = IERC721(nft).balanceOf(owner);
      }

      // OpenNFTs
      if (supportInterface[3]) {
        nftData.owner = IOpenNFTs(nft).owner();
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
