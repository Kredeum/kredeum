// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/ICloneFactoryV2.sol";

/// @title Clone Factory
/// @notice Generic Clone Factory to create multiple Clones from Templates
/// @dev CloneFactory is ICloneFactory and Ownable
contract CloneFactoryV2 is ICloneFactoryV2, Ownable {
    /// @notice Implementations addresses
    address[] public implementations;

    /// @notice New Implemention Event
    /// @param implementation implementation address
    /// @param template template address
    /// @param creator creator address
    /// @param clone cloned by this contract
    event NewImplementation(
        address indexed implementation,
        address indexed template,
        address indexed creator,
        uint256 index,
        bool clone
    );

    /// @notice Implementations count
    /// @return count : number of implementations
    function implementationsCount() public view override(ICloneFactoryV2) returns (uint256) {
        return implementations.length;
    }

    /// @notice ADD Implementation public onlyOwner
    /// @param  implementation : implementation address
    /// @param  template : template address
    function addImplementation(address implementation, address template) public override(ICloneFactoryV2) onlyOwner {
        _addImplementation(implementation, template, false);
    }

    /// @notice Clone Template
    /// @param  template : template address
    /// @return addr : clone address
    function _clone(address template) internal returns (address addr) {
        /// @notice clone template and get clone address
        addr = Clones.clone(template);

        /// @notice register clone as new implementation
        _addImplementation(addr, template, true);
    }

    /// @notice ADD Implementation internal
    /// @param  implementation : implementation address
    /// @param  template : template address
    function _addImplementation(
        address implementation,
        address template,
        bool clone
    ) internal {
        /// @notice register implementation
        implementations.push(implementation);

        /// @notice emit event NewImplementation
        emit NewImplementation(implementation, template, _msgSender(), implementationsCount(), clone);
    }
}
