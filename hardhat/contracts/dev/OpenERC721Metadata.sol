// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../interfaces/IERC721Metadata.sol";

contract OpenERC721Metadata is IERC721Metadata {
    string internal _name;

    string internal _symbol;

    mapping(uint256 => string) internal _tokenURIs;

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenID) public view virtual returns (string memory) {
        return _tokenURIs[tokenID];
    }

    function _setName(string memory newName) internal {
        _name = newName;
    }

    function _setSymbol(string memory newSymbol) internal {
        _symbol = newSymbol;
    }

    function _setTokenURI(uint256 tokenID, string memory newTokenURI) internal {
        _tokenURIs[tokenID] = newTokenURI;
    }

    function _burn(uint256 tokenID) internal virtual {
        delete _tokenURIs[tokenID];
    }
}
