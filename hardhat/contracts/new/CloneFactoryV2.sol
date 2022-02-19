// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interfaces/ICloneFactoryV2.sol";

/// @title Clone Factory
/// @notice Generic Clone Factory to create multiple Clones from Templates
/// @dev CloneFactory is ICloneFactory and Ownable
contract CloneFactoryV2 is ICloneFactoryV2, Ownable {
    /// @notice Implementations addresses
    address[] public implementations;

    /// @notice Implementations count
    /// @return count : number of implementations
    function implementationsCount() public view override(ICloneFactoryV2) returns (uint256) {
        return implementations.length;
    }

    /// @notice ADD Implementations public onlyOwner
    /// @param  implementationsToAdd : new implementations addresses
    function implementationsAdd(address[] calldata implementationsToAdd) external override(ICloneFactoryV2) onlyOwner {
        for (uint256 i = 0; i < implementationsToAdd.length; i += 1) {
            _implementationAdd(implementationsToAdd[i]);
        }
    }

    /// @notice ADD Implementation internal
    /// @param  implementationToAdd : implementation address
    function _implementationAdd(address implementationToAdd) internal virtual {
        _implementationNew(implementationToAdd);
    }

    /// @notice Clone Template
    /// @param  template : template address
    /// @return addr : clone address
    function _clone(address template) internal returns (address addr) {
        /// @notice clone template and get clone address
        addr = Clones.clone(template);

        /// @notice register clone as new implementation
        _implementationNew(addr);
    }

    /// @notice NEW Implementation internal
    /// @param  implementation : implementation address
    function _implementationNew(address implementation) internal {
        /// @notice register implementation
        implementations.push(implementation);

        /// @notice emit event ImplementationNew
        emit ImplementationNew(implementation, _msgSender(), implementationsCount());
    }
}
