// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../interfaces/ICloneFactoryV2.sol";
import "../interfaces/IContractProbe.sol";

/// @title Clone Factory
/// @notice Generic Clone Factory to create multiple Clones from Templates
/// @dev CloneFactory is ICloneFactory and Ownable
contract CloneFactoryV2 is ICloneFactoryV2, Ownable {
    /// @notice Implementations addresses
    address[] public implementations;

    /// @notice Probe smartcontract address
    address private immutable contractProbe;

    /// @notice New Implemention Event
    /// @param implementation implementation address
    /// @param template template address
    /// @param creator creator address
    /// @param count implementations count
    event ImplementationNew(
        address indexed implementation,
        address indexed template,
        address indexed creator,
        uint256 count
    );

    /// @notice initialize probe smartcontract
    constructor(address probe) {
        contractProbe = probe;
    }

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
    /// @dev Only add if contract, and add proxied template
    function _implementationAdd(address implementationToAdd) internal {
        (bool isContract, address forwardTo) = IContractProbe(contractProbe).probe(implementationToAdd);
        if (isContract) {
            _implementationNew(implementationToAdd, forwardTo);
        }
    }

    /// @notice Clone Template
    /// @param  template : template address
    /// @return addr : clone address
    function _clone(address template) internal returns (address addr) {
        /// @notice clone template and get clone address
        addr = Clones.clone(template);

        /// @notice register clone as new implementation
        _implementationNew(addr, template);
    }

    /// @notice NEW Implementation internal
    /// @param  implementation : implementation address
    function _implementationNew(address implementation, address template) internal {
        /// @notice register implementation
        implementations.push(implementation);

        /// @notice emit event ImplementationNew
        emit ImplementationNew(implementation, template, _msgSender(), implementationsCount());
    }
}
