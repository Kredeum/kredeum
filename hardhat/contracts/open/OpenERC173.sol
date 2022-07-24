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
    bool private _openERC173Initialized;
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) external override(IERC173) onlyOwner {
        _setOwner(newOwner);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC721) returns (bool) {
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }

    function owner() public view override(IERC173) returns (address) {
        return _owner;
    }

    function _initialize(address owner_) internal {
        require(_openERC173Initialized == false, "Init already call");
        _openERC173Initialized = true;

        _setOwner(owner_);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
