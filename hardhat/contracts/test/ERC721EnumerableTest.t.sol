// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC165.sol";

abstract contract ERC721EnumerableTest is Test {
    address private _collection;
    string private _tokenURI;
    address private _owner = address(0x2);
    address private _minter = address(0x22);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function setUpERC721Enumerable() public {
        _collection = constructorTest(_owner);
        (_tokenID0, ) = mintTest(_collection, _minter);
    }

    function testERC721EnumerableTotalSupply() public {
        assertEq(IERC721Enumerable(_collection).totalSupply(), 1);
    }

    function testERC721EnumerableTotalSupplyIncrement() public {
        assertEq(IERC721Enumerable(_collection).totalSupply(), 1);
        mintTest(_collection, _tester);
        assertEq(IERC721Enumerable(_collection).totalSupply(), 2);
    }

    function testERC721EnumerableTokenByIndex() public {
        assertEq(IERC721Enumerable(_collection).tokenByIndex(0), _tokenID0);
    }

    function testFailERC721EnumerableTokenByIndex() public view {
        IERC721Enumerable(_collection).tokenByIndex(1);
    }

    function testERC721EnumerableTokenByIndexSecond() public {
        (uint256 tokenID, ) = mintTest(_collection, _tester);
        assertEq(IERC721Enumerable(_collection).tokenByIndex(1), tokenID);
    }

    function testERC721EnumerableTokenOfOwnerByIndex() public {
        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 0), _tokenID0);
    }

    function testFailERC721EnumerableTokenOfOwnerByIndex() public view {
        IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 1);
    }

    function testERC721EnumerableTokenOfOwnerByIndexOther() public {
        console.log("_tokenID0", _tokenID0);
        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 0), _tokenID0);

        changePrank(_tester);
        (uint256 tokenID, ) = mintTest(_collection, _tester);
        console.log("tokenID", tokenID);

        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_tester, 0), tokenID);
    }

    function testERC721EnumerableSupportsInterface() public {
        assertTrue(IERC165(_collection).supportsInterface(type(IERC721Enumerable).interfaceId));
    }
}
