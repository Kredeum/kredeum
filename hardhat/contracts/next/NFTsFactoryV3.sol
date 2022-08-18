// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "OpenNFTs/contracts/OpenERC/OpenERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import "OpenNFTs/contracts/interfaces/IOpenRegistry.sol";
import "../interfaces/INFTsFactoryV3.sol";
import "../interfaces/IOpenNFTsV4.sol";
import "./NFTsResolver.sol";

/// @title NFTsFactory smartcontract
/// @dev is CloneFactory
/// @notice Templates are OPEN_NFTS contracts
/// @notice Implementations are ERC721 contracts (including OPEN_NFTS clones)
/// @notice Factory can clone OPEN_NFTs templates to implementations
/// @notice Factory can also add ERC721 contracts to implementations
contract NFTsFactoryV3 is INFTsFactoryV3, OpenERC173 {
    /// @notice Named Templates
    mapping(string => address) public templates;

    address public nftsResolver;

    constructor(address initialOwner, address resolver) {
        _transferOwnership(initialOwner);
        nftsResolver = resolver;
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
        clone_ = Clones.clone(_template(templateName));
        IOpenNFTsV4(clone_).initialize(name, symbol, msg.sender, options);
        IOpenRegistry(nftsResolver).addAddress(clone_);
    }

    /// @notice Set Template by Name
    /// @param templateName Name of the template
    /// @param template Address of the template
    function setTemplate(string calldata templateName, address template) public override(INFTsFactoryV3) onlyOwner {
        require(
            IERC165(template).supportsInterface(type(IOpenCloneable).interfaceId),
            "Not valid OpenCloneable template"
        );
        templates[templateName] = template;

        /// @notice emit event ImplementationNew
        emit SetTemplate(templateName, template);
    }

    /// @notice Get Template
    /// @param  templateName : template name
    /// @return  template : template address
    function _template(string memory templateName) internal view virtual returns (address template) {
        require(templates[templateName] != address(0), "Bad Template");

        template = templates[templateName];
    }
}
