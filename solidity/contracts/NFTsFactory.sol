// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "./interfaces/INFTsFactory.sol";
import "./interfaces/IOpenNFTsV2.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTsFactory is CloneFactory, INFTsFactory {
  using ERC165Checker for address;

  uint8 public constant ERC721 = 0;
  uint8 public constant ERC721_METADATA = 1;
  uint8 public constant ERC721_ENUMERABLE = 2;
  uint8 public constant OPEN_NFTS = 3;

  bytes4 public constant ERC721_SIG = bytes4(0x80ac58cd);
  bytes4 public constant ERC721_METADATA_SIG = bytes4(0x780e9d63);
  bytes4 public constant ERC721_ENUMERABLE_SIG = bytes4(0x780e9d63);
  bytes4 public constant OPEN_NFTS_SIG = type(IOpenNFTsV2).interfaceId;

  function withdrawEther() external override(INFTsFactory) onlyOwner {
    Address.sendValue(payable(msg.sender), address(this).balance);
  }

  function balancesOf(address owner)
    external
    view
    override(INFTsFactory)
    returns (NftData[] memory nftData)
  {
    nftData = new NftData[](implementations.length);
    for (uint256 i = 0; i < implementations.length; i += 1) {
      nftData[i] = balanceOf(implementations[i], owner);
    }
  }

  function clone(string memory name_, string memory symbol_)
    public
    override(INFTsFactory)
    returns (address clone_)
  {
    clone_ = _clone();
    require(clone_.supportsInterface(OPEN_NFTS_SIG), "Clone is not Open NFTs contract");

    IOpenNFTsV2(clone_).initialize(name_, symbol_);
    IOpenNFTsV2(clone_).transferOwnership(msg.sender);
  }

  function balanceOf(address nft, address owner)
    public
    view
    override(INFTsFactory)
    returns (NftData memory nftData)
  {
    bytes4[] memory iface = new bytes4[](4);
    iface[ERC721] = ERC721_SIG;
    iface[ERC721_METADATA] = ERC721_METADATA_SIG;
    iface[ERC721_ENUMERABLE] = ERC721_ENUMERABLE_SIG;
    iface[OPEN_NFTS] = OPEN_NFTS_SIG;
    bool[] memory supportInterface = nft.getSupportedInterfaces(iface);

    if (supportInterface[ERC721]) {
      nftData.nft = nft;
      nftData.balanceOf = IERC721(nft).balanceOf(owner);

      if (supportInterface[ERC721_METADATA]) {
        nftData.name = IERC721Metadata(nft).name();
        nftData.symbol = IERC721Metadata(nft).symbol();
      }

      if (supportInterface[ERC721_ENUMERABLE]) {
        nftData.totalSupply = IERC721Enumerable(nft).totalSupply();
      }

      if (supportInterface[OPEN_NFTS]) {
        nftData.owner = IOpenNFTsV2(nft).owner();
      }
    }
  }
}
