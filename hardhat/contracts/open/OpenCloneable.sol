// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (utils/introspection/ERC165.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/utils/introspection/ERC165.sol
//
//                OpenERC165
//

pragma solidity 0.8.9;

import "../interfaces/IOpenCloneable.sol";
import "./OpenERC165.sol";

abstract contract OpenCloneable is IOpenCloneable, OpenERC165 {
    bool private _once;
    string private _template;
    uint256 private _version;

    function getTemplate() external view override(IOpenCloneable) returns (string memory) {
        return _template;
    }

    function getVersion() external view override(IOpenCloneable) returns (uint256) {
        return _version;
    }

    function _initialize(string memory template_, uint256 version_) internal {
        require(_once == false, "Only once!");
        _once = true;

        _template = template_;
        _version = version_;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC165) returns (bool) {
        return interfaceId == type(IOpenCloneable).interfaceId || super.supportsInterface(interfaceId);
    }
}
