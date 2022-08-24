// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "OpenNFTs/contracts/OpenERC/OpenERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import "OpenNFTs/contracts/interfaces/IOpenRegistry.sol";
import "../interfaces/IOpenNFTsFactoryV3.sol";
import "../interfaces/IOpenNFTsV4.sol";
import "./OpenNFTsResolver.sol";

/// @title NFTsFactory smartcontract
/// @dev is CloneFactory
/// @notice Templates are OPEN_NFTS contracts
/// @notice Implementations are ERC721 contracts (including OPEN_NFTS clones)
/// @notice Factory can clone OPEN_NFTs templates to implementations
/// @notice Factory can also add ERC721 contracts to implementations
contract OpenNFTsFactoryV3 is IOpenNFTsFactoryV3, OpenERC173 {
    /// @notice Named Templates

    mapping(string => uint256) private _numTemplates;
    address[] public templates;

    address public nftsResolver;

    constructor(address initialOwner) {
        OpenERC173._transferOwnership(initialOwner);
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
    ) external override(IOpenNFTsFactoryV3) returns (address clone_) {
        clone_ = _clone(template(templateName));

        IOpenNFTsV4(clone_).initialize(name, symbol, msg.sender, 0, address(0), 0, options);

        IOpenRegistry(nftsResolver).addAddress(clone_);

        emit Clone(templateName, clone_, name, symbol, options);
    }

    function countTemplates() external view override(IOpenNFTsFactoryV3) returns (uint256 count) {
        count = templates.length;
    }

    function setResolver(address resolver_) public override(IOpenNFTsFactoryV3) onlyOwner {
        nftsResolver = resolver_;

        emit SetResolver(nftsResolver);
    }

    /// @notice Set Template by Name
    /// @param templateName_ Name of the template
    /// @param template_ Address of the template
    function setTemplate(string memory templateName_, address template_) public override(IOpenNFTsFactoryV3) onlyOwner {
        require(IERC165(template_).supportsInterface(type(IOpenCloneable).interfaceId), "Not OpenCloneable");
        require(IOpenCloneable(template_).initialized(), "Not initialized");
        require(template_.code.length != 45, "Clone not valid template");

        uint256 num = _numTemplates[templateName_];
        if (num >= 1) {
            templates[num - 1] = template_;
        } else {
            templates.push(template_);
            num = templates.length;

            _numTemplates[templateName_] = num;
        }

        IOpenRegistry(nftsResolver).addAddress(template_);

        emit SetTemplate(templateName_, template_, num);
    }

    /// @notice Get Template
    /// @param  templateName : template name
    /// @return template_ : template address
    function template(string memory templateName) public view override(IOpenNFTsFactoryV3) returns (address template_) {
        uint256 num = _numTemplates[templateName];
        require(num >= 1, "Invalid Template");

        template_ = templates[num - 1];
        require(template_ != address(0), "No Template");
    }

    /// @notice Clone template (via EIP-1167)
    /// @param  template_ : template address
    /// @return clone_ : clone address
    function _clone(address template_) private returns (address clone_) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, template_))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            clone_ := create(0, ptr, 0x37)
        }
        assert(clone_ != address(0));
    }
}
