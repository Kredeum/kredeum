// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/ICloneFactoryV2.sol";

/// @title Abstract Clone Factory
/// @notice Generic Clone Factory to create multiple Clones from Templates
/// @dev CloneFactory is ICloneFactory and Ownable
abstract contract CloneFactoryV2 is ICloneFactoryV2, Ownable {
    /// @notice Implementations addresses
    address[] public implementations;

    /// @notice Named Templates
    mapping(string => address) public templates;

    function implementationsList() external view override(ICloneFactoryV2) returns (address[] memory) {
        return implementations;
    }

    /// @notice Add Implementations, public onlyOwner
    /// @param  implementationsToAdd : new implementations addresses
    function implementationsAdd(address[] calldata implementationsToAdd) external override(ICloneFactoryV2) onlyOwner {
        for (uint256 i = 0; i < implementationsToAdd.length; i += 1) {
            _implementationNew(implementationsToAdd[i]);
        }
    }

    /// @notice Implementations count
    /// @return count : number of implementations
    function implementationsCount() external view override(ICloneFactoryV2) returns (uint256) {
        return implementations.length;
    }

    /// @notice Set Template
    /// @param templateName Name of the template
    /// @param template Address of the template
    function templateSet(string calldata templateName, address template)
        public
        virtual
        override(ICloneFactoryV2)
        onlyOwner
    {
        templates[templateName] = template;

        emit TemplateSet(templateName, template);
    }

    /// @notice New Implementation internall
    /// @param  implementation : implementation address
    function _implementationNew(address implementation) internal virtual {
        /// @notice register implementation
        implementations.push(implementation);

        /// @notice emit event ImplementationNew
        emit ImplementationNew(implementation, _msgSender(), implementations.length - 1);
    }

    function _template(string memory templateName) internal view virtual returns (address template) {
        require(templates[templateName] != address(0), "Bad Template");

        template = templates[templateName];
    }

    /// @notice Clone Template
    /// @param  templateName : template name
    /// @return clone_ : clone address
    function _clone(string memory templateName) internal returns (address clone_) {
        /// @notice clone template and get clone address
        clone_ = Clones.clone(_template(templateName));

        /// @notice register clone as new implementation
        _implementationNew(clone_);
    }
}
