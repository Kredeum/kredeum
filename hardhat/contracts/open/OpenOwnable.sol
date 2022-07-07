// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (access/Ownable.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/access/Ownable.sol

pragma solidity 0.8.9;

import "./OpenERC165.sol";
import "../interfaces/IERC173.sol";

abstract contract OpenOwnable is IERC173, OpenERC165 {
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Not owner");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC165) returns (bool) {
        return
            interfaceId == 0x7f5828d0 || // = type(IERC173).interfaceId;
            super.supportsInterface(interfaceId);
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
