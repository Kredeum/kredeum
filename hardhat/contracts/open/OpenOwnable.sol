// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (access/Ownable.sol)
pragma solidity 0.8.9;

import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";

contract OpenOwnable is IERC165, IERC173 {
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Not owner");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
        return interfaceId == 0x7f5828d0; // = type(IERC173).interfaceId;
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
