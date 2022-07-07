// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (security/Pausable.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/security/Pausable.sol

pragma solidity 0.8.9;

import "./OpenERC165.sol";
import "../interfaces/IOpenPausable.sol";

abstract contract OpenPausable is IOpenPausable, OpenERC165 {
    bool private _paused;

    modifier whenNotPaused() {
        require(!_paused, "Paused !");
        _;
    }

    function togglePause() public virtual override(IOpenPausable) {
        _paused = !_paused;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC165) returns (bool) {
        return
            interfaceId == type(IOpenPausable).interfaceId || // 0x... ?
            super.supportsInterface(interfaceId);
    }
}
