// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./CloneFactoryV2.sol";
import "./interfaces/INFTsFactoryV2.sol";
import "./interfaces/IOpenNFTsV3.sol";
import "../deployed/interfaces/IOpenNFTsV2.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title NFTsFactory smartcontract
/// @dev is CloneFactory
contract NFTsFactoryV2 is CloneFactoryV2, INFTsFactoryV2 {
    using ERC165Checker for address;

    mapping(string => address) public templates;

    uint8 public constant version = 2;

    uint8 internal constant ERC721 = 0;
    uint8 internal constant ERC721_METADATA = 1;
    uint8 internal constant ERC721_ENUMERABLE = 2;
    uint8 internal constant OPEN_NFTS_V2 = 3;
    uint8 internal constant OPEN_NFTS_V3 = 4;

    bytes4 internal constant ERC721_SIG = bytes4(0x80ac58cd);
    bytes4 internal constant ERC721_METADATA_SIG = bytes4(0x780e9d63);
    bytes4 internal constant ERC721_ENUMERABLE_SIG = bytes4(0x780e9d63);
    bytes4 internal constant OPEN_NFTS_V2_SIG = type(IOpenNFTsV2).interfaceId;
    bytes4 internal constant OPEN_NFTS_V3_SIG = type(IOpenNFTsV3).interfaceId;

    /// @notice balancesOf address
    /// @param addr  address of account
    /// @return nftData Array of nftData balances
    function balancesOf(address addr) external view override(INFTsFactoryV2) returns (NftData[] memory nftData) {
        nftData = new NftData[](implementations.length);
        for (uint256 i = 0; i < implementations.length; i += 1) {
            nftData[i] = balanceOf(implementations[i], addr);
        }
    }

    function templateSet(string calldata templateName, address template) external {
        require(template.supportsInterface(ERC721_SIG), "Implementation not ERC721 contract");
        templates[templateName] = template;

        emit TemplateNew(template, templateName);
    }

    /// @notice clone template
    /// @param name name of Clone collection
    /// @param symbol symbol of Clone collection
    /// @return clone_ Address of Clone collection
    function clone(
        string memory name,
        string memory symbol,
        string memory templateName
    ) external override(INFTsFactoryV2) returns (address clone_) {
        address template = templates[templateName];
        require(template != address(0), "Bad Template");
        require(
            template.supportsInterface(OPEN_NFTS_V2_SIG) || template.supportsInterface(OPEN_NFTS_V3_SIG),
            "Template not OpenNFTs V2 orV3 contract"
        );
        clone_ = _clone(templates[templateName]);

        if (template.supportsInterface(OPEN_NFTS_V2_SIG)) {
            IOpenNFTsV2(clone_).initialize(name, symbol);
        } else {
            IOpenNFTsV3(clone_).initialize(name, symbol, _msgSender(), false);
        }
    }

    /// @notice ADD Implementation internal
    /// @param  implementationToAdd : implementation address
    function _implementationAdd(address implementationToAdd) internal override(CloneFactoryV2) {
        require(implementationToAdd.supportsInterface(ERC721_SIG), "Implementation not ERC721 contract");
        super._implementationNew(implementationToAdd);
    }

    /// @notice balanceOf
    /// @param nft nft address of NFT collection
    /// @param owner address of account
    /// @return nftData nftData balances
    function balanceOf(address nft, address owner) internal view returns (NftData memory nftData) {
        bytes4[] memory iface = new bytes4[](5);
        iface[ERC721] = ERC721_SIG;
        iface[ERC721_METADATA] = ERC721_METADATA_SIG;
        iface[ERC721_ENUMERABLE] = ERC721_ENUMERABLE_SIG;
        iface[OPEN_NFTS_V2] = OPEN_NFTS_V2_SIG;
        iface[OPEN_NFTS_V3] = OPEN_NFTS_V3_SIG;
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

            if (supportInterface[OPEN_NFTS_V2] || supportInterface[OPEN_NFTS_V3]) {
                nftData.owner = OwnableUpgradeable(nft).owner();
            }
        }
    }
}
