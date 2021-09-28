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

  uint256 public cloneCost;

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
  event NewCloneCost(uint256 indexed cloneCost);

  constructor(
    uint256 _cloneCost,
    address _openNFTs,
    address _contractprobe
  ) CloneFactory(_contractprobe) {
    setCloneCost(_cloneCost);
    setDefaultTemplate(_openNFTs);
  }

  function balanceOf(address nft, address owner) public view returns (NftData memory nftData) {
    bytes4[] memory iface = new bytes4[](4);
    iface[ERC721] = ERC721Sig;
    iface[ERC721Metadata] = ERC721MetadataSig;
    iface[ERC721Enumerable] = ERC721EnumerableSig;
    iface[OpenNFTs] = OpenNFTsSig;
    bool[] memory supportInterface = nft.getSupportedInterfaces(iface);

    if (supportInterface[ERC721]) {
      nftData.nft = nft;

      if (supportInterface[ERC721Metadata]) {
        nftData.name = IERC721Metadata(nft).name();
        nftData.symbol = IERC721Metadata(nft).symbol();
      }

      if (owner == address(0)) {
        if (supportInterface[ERC721Enumerable]) {
          nftData.balance = IERC721Enumerable(nft).totalSupply();
        }
      } else {
        nftData.balance = IERC721(nft).balanceOf(owner);
      }

      if (supportInterface[OpenNFTs]) {
        nftData.owner = IOpenNFTs(nft).owner();
      }
    }
  }

  function balancesOf(address owner) external view returns (NftData[] memory nftData) {
    nftData = new NftData[](implementations.length);
    for (uint256 i = 0; i < implementations.length; i += 1) {
      nftData[i] = balanceOf(implementations[i], owner);
    }
  }

  function setCloneCost(uint256 _cloneCost) public onlyOwner {
    cloneCost = _cloneCost;

    emit NewCloneCost(cloneCost);
  }

  function clone(string memory _name, string memory _symbol)
    public
    payable
    returns (address clone_)
  {
    require(msg.value >= cloneCost && cloneCost > 0, "Clone is payable");

    clone_ = _clone();
    require(clone_.supportsInterface(OpenNFTsSig), "Clone is not Open NFTs contract");

    IOpenNFTs(clone_).initialize(_name, _symbol);
    IOpenNFTs(clone_).transferOwnership(msg.sender);
  }

  function withdrawEther() external onlyOwner {
    (bool succeed, ) = msg.sender.call{value: address(this).balance}("");
    require(succeed, "Failed to withdraw Ether");
  }
}
