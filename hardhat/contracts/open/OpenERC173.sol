// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (access/Ownable.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/access/Ownable.sol

//
//                OpenERC165
//                     |
//                OpenERC721
//                     |
//                OpenERC173
//

pragma solidity 0.8.9;

import "./OpenERC721.sol";
import "../interfaces/IERC173.sol";

abstract contract OpenERC173 is IERC173, OpenERC721 {
    bool private _once;
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) public override(IERC173) onlyOwner {
        _setOwner(newOwner);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC721) returns (bool) {
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }

    function owner() public view override(IERC173) returns (address) {
        return _owner;
    }

    function initialize(address owner_) internal {
        require(_once == false, "Only once!");
        _setOwner(owner_);
        _once = true;
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
