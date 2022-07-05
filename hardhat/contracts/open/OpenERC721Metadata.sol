// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (token/ERC721/ERC721.sol)
pragma solidity 0.8.9;

import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC165.sol";

contract OpenERC721Metadata is IERC165, IERC721Metadata {
    string internal _name;

    string internal _symbol;

    mapping(uint256 => string) internal _tokenURIs;

    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == 0x5b5e139f; // = type(IERC721Metadata).interfaceId
    }

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

    function _burn(uint256 tokenID) internal virtual {
        delete _tokenURIs[tokenID];
    }
}
