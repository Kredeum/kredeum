// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../interfaces/IERC173.sol";

contract OpenOwnable is IERC173 {
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) public override(IERC173) onlyOwner {
        _setOwner(newOwner);
    }

    function owner() public view override(IERC173) returns (address) {
        return _owner;
    }

    function _setOwner(address newOwner) internal {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
