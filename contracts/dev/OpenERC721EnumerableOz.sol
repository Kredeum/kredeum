// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (token/ERC721/extensions/ERC721Enumerable.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/...
// ...contracts/token/ERC721/extensions/ERC721Enumerable.sol

//
//                OpenERC165
//                     |
//                OpenERC721
//                     |
//            OpenERC721EnumerableOz
//
pragma solidity ^0.8.19;

import "OpenNFTsOpenERC/OpenERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";

abstract contract OpenERC721EnumerableOz is IERC721Enumerable, OpenERC721 {
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC721) returns (bool) {
        return interfaceId == 0x780e9d63 || super.supportsInterface(interfaceId);
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        override(IERC721Enumerable)
        returns (uint256)
    {
        require(index < OpenERC721.balanceOf(owner), "Invalid index!");
        return _ownedTokens[owner][index];
    }

    function totalSupply() public view override(IERC721Enumerable) returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 index) public view override(IERC721Enumerable) returns (uint256) {
        require(index < OpenERC721EnumerableOz.totalSupply(), "Invalid index!");
        return _allTokens[index];
    }

    function _mintEnumerable(address to, uint256 tokenID) internal {
        uint256 length = OpenERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenID;
        _ownedTokensIndex[tokenID] = length;

        _allTokensIndex[tokenID] = _allTokens.length;
        _allTokens.push(tokenID);
    }

    function _burnEnumerable(uint256 tokenID) internal {
        _removeTokenFromOwnerEnumeration(ownerOf(tokenID), tokenID);
        _removeTokenFromAllTokensEnumeration(tokenID);
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenID) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = OpenERC721.balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenID];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenID];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint256 tokenID) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenID];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenID];
        _allTokens.pop();
    }
}
