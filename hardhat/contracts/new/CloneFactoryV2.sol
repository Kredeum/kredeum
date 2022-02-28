// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/ICloneFactoryV2.sol";

/// @title Abstract Clone Factory V2
/// @notice Generic Clone Factory to clone Templates
/// @dev CloneFactory is ICloneFactory and Ownable
abstract contract CloneFactoryV2 is ICloneFactoryV2, Ownable {
    /// @notice Implementations addresses
    address[] public implementations;

    /// @notice Named Templates
    mapping(string => address) public templates;

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

    /// @notice Set Template by Name
    /// @param templateName Name of the template
    /// @param template Address of the template
    function templateSet(string calldata templateName, address template)
        public
        virtual
        override(ICloneFactoryV2)
        onlyOwner
    {
        templates[templateName] = template;

        /// @notice emit event ImplementationNew
        emit TemplateSet(templateName, template);
    }

    /// @notice New Implementation
    /// @param  implementation : implementation address
    function _implementationNew(address implementation) internal virtual {
        implementations.push(implementation);

        emit ImplementationNew(implementation, _msgSender(), implementations.length - 1);
    }

    /// @notice Get Template
    /// @param  templateName : template name
    /// @return  template : template address
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
