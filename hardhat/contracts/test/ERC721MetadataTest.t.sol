// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC165.sol";

abstract contract ERC721MetadataTest is Test {
    address private _collection;
    string private _name;
    string private _symbol;
    string private _tokenURI0;
    uint256 private _tokenID0;
    address private _minter = address(0x23);

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function setUpERC721Metadata(string memory name_, string memory symbol_) public {
        _name = name_;
        _symbol = symbol_;
        _collection = constructorTest(_minter);
        (_tokenID0, _tokenURI0) = mintTest(_collection, _minter);
    }

    function testERC721MetadataName() public {
        assertEq(IERC721Metadata(_collection).name(), _name);
    }

    function testERC721MetadataSymbol() public {
        assertEq(IERC721Metadata(_collection).symbol(), _symbol);
    }

    function testERC721MetadataURI() public {
        assertEq(IERC721Metadata(_collection).tokenURI(_tokenID0), _tokenURI0);
    }

    function testERC721MetadataSupportsInterface() public {
        assertTrue(IERC165(_collection).supportsInterface(type(IERC721Metadata).interfaceId));
    }
}
