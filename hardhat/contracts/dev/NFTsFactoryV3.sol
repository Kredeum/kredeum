// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../CloneFactoryV2.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/INFTsFactoryV3.sol";
import "../interfaces/IOpenNFTsV4.sol";

/// @title NFTsFactory smartcontract
/// @dev is CloneFactory
/// @notice Templates are OPEN_NFTS contracts
/// @notice Implementations are ERC721 contracts (including OPEN_NFTS clones)
/// @notice Factory can clone OPEN_NFTs templates to implementations
/// @notice Factory can also add ERC721 contracts to implementations
contract NFTsFactoryV3 is CloneFactoryV2, INFTsFactoryV3 {
    using ERC165Checker for address;

    uint8 internal constant _IERC721 = 0;
    uint8 internal constant _IERC721_METADATA = 1;
    uint8 internal constant _IERC721_ENUMERABLE = 2;
    uint8 internal constant _IERC173 = 3;
    uint8 internal constant _IOPEN_NFTS = 4;

    bytes4 internal constant _IERC721_SIG = bytes4(0x80ac58cd);
    bytes4 internal constant _IERC721_METADATA_SIG = bytes4(0x780e9d63);
    bytes4 internal constant _IERC721_ENUMERABLE_SIG = (0x780e9d63);
    bytes4 internal constant _IERC173_SIG = bytes4(0x7f5828d0);
    bytes4 internal constant _IOPEN_NFTS_SIG = type(IOpenNFTsV4).interfaceId;

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    /// @notice clone template
    /// @param name name of Clone collection
    /// @param symbol symbol of Clone collection
    /// @return clone_ Address of Clone collection
    function clone(
        string memory name,
        string memory symbol,
        string memory templateName,
        bool[] memory options
    ) external override(INFTsFactoryV3) returns (address clone_) {
        clone_ = _clone(templateName);
        IOpenNFTsV4(clone_).initialize(name, symbol, _msgSender(), options);
    }

    /// @notice balancesOf address for each implementations
    /// @param addr  address of account
    /// @return nftData Array of nftData balances
    function balancesOf(address addr) external view override(INFTsFactoryV3) returns (NftData[] memory nftData) {
        nftData = new NftData[](implementations.length);
        for (uint256 i = 0; i < implementations.length; i += 1) {
            nftData[i] = _balanceOf(implementations[i], addr);
        }
    }

    /// @notice Set Template, overrides generic CloneFactory
    /// @param templateName Name of the template
    /// @param template Address of the template
    function templateSet(string calldata templateName, address template) public override(CloneFactoryV2) onlyOwner {
        require(template.supportsInterface(_IOPEN_NFTS_SIG), "Not valid OpenNFTs Template");

        super.templateSet(templateName, template);
    }

    /// @notice New Implementation internal, overrides generic CloneFactory
    /// @param  implementation : implementation address
    function _implementationNew(address implementation) internal override(CloneFactoryV2) {
        require(implementation.supportsInterface(_IERC721_SIG), "Not ERC721");

        super._implementationNew(implementation);
    }

    /// @notice _balanceOf
    /// @param nft nft address of NFT collection
    /// @param addr address of account
    /// @return nftData nftData balances
    function _balanceOf(address nft, address addr) internal view returns (NftData memory nftData) {
        bytes4[] memory iface = new bytes4[](5);
        iface[_IERC721] = _IERC721_SIG;
        iface[_IERC721_METADATA] = _IERC721_METADATA_SIG;
        iface[_IERC721_ENUMERABLE] = _IERC721_ENUMERABLE_SIG;
        iface[_IERC173] = _IERC173_SIG;

        bool[] memory supportInterface = nft.getSupportedInterfaces(iface);

        if (supportInterface[_IERC721]) {
            nftData.nft = nft;
            nftData.balanceOf = IERC721(nft).balanceOf(addr);

            if (supportInterface[_IERC721_METADATA]) {
                nftData.name = IERC721Metadata(nft).name();
                nftData.symbol = IERC721Metadata(nft).symbol();
            }

            if (supportInterface[_IERC721_ENUMERABLE]) {
                nftData.totalSupply = IERC721Enumerable(nft).totalSupply();
            }
        }
        if (supportInterface[_IERC173]) {
            nftData.owner = IERC173(nft).owner();
        }
    }
}
