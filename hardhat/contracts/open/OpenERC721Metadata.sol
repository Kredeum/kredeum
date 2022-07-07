// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (token/ERC721/ERC721.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721/ERC721.sol

pragma solidity 0.8.9;

import "./OpenERC721.sol";
import "../interfaces/IERC721Metadata.sol";

abstract contract OpenERC721Metadata is IERC721Metadata, OpenERC721 {
    string internal _name;

    string internal _symbol;

    mapping(uint256 => string) internal _tokenURIs;

    function name() public view virtual override(IERC721Metadata) returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override(IERC721Metadata) returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenID) public view virtual override(IERC721Metadata) returns (string memory) {
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

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC721) returns (bool) {
        return
            interfaceId == 0x5b5e139f || // = type(IERC721Metadata).interfaceId
            super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenID) internal virtual override(OpenERC721) {
        delete _tokenURIs[tokenID];
        super._burn(tokenID);
    }
}
