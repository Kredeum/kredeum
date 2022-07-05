// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (security/Pausable.sol)
pragma solidity 0.8.9;

contract OpenPausable {
    bool private _paused;

    modifier whenNotPaused() {
        require(!_paused, "Paused !");
        _;
    }

    function _togglePause() internal {
        _paused = !_paused;
    }
}
