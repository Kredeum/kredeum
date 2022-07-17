// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IOpenNFTsV4.sol";

abstract contract OpenNFTsBurnTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256);

    function burnTest(address collection_, uint256 tokenID_) public virtual;

    function setUpOpenNFTsBurn() public {
        _collection = constructorTest(_owner);

        _tokenID0 = mintTest(_collection, _minter);
    }

    function testBurn() public {
        burnTest(_collection, _tokenID0);
        assertEq(IERC721Enumerable(_collection).totalSupply(), 0);
    }

    function testBurnWithEnumerable() public {}

    function testBurnWithMetadata() public {}

    function testFailBurnTokenByIndex() public {
        burnTest(_collection, _tokenID0);
        IERC721Enumerable(_collection).tokenByIndex(0);
    }

    function testFailBurnTokenOfOwnerByIndex() public {
        burnTest(_collection, _tokenID0);
        IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 0);
    }

    function testBurnSecondOne() public {
        changePrank(_tester);
        uint256 tokenID = mintTest(_collection, _tester);

        assertEq(IERC721Enumerable(_collection).totalSupply(), 2);
        assertEq(IERC721Enumerable(_collection).tokenByIndex(0), _tokenID0);
        assertEq(IERC721Enumerable(_collection).tokenByIndex(1), tokenID);
        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 0), _tokenID0);
        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_tester, 0), tokenID);

        burnTest(_collection, tokenID);

        assertEq(IERC721Enumerable(_collection).totalSupply(), 1);
        assertEq(IERC721Enumerable(_collection).tokenByIndex(0), _tokenID0);
        assertEq(IERC721Enumerable(_collection).tokenOfOwnerByIndex(_minter, 0), _tokenID0);
    }

    function testFailBurnSecondOneTokenByIndex() public {
        changePrank(_tester);
        uint256 tokenID = mintTest(_collection, _tester);
        IOpenNFTsV4(_collection).burn(tokenID);
        IERC721Enumerable(_collection).tokenByIndex(1);
    }

    function testFailBurnSecondOneTokennOfOwnerByIndex() public {
        changePrank(_tester);
        uint256 tokenID = mintTest(_collection, _tester);
        IOpenNFTsV4(_collection).burn(tokenID);
        IERC721Enumerable(_collection).tokenOfOwnerByIndex(_tester, 0);
    }

    function testBurnEnumerable() public {
        assertEq(IERC721Enumerable(_collection).totalSupply(), 1);
        burnTest(_collection, _tokenID0);
        assertEq(IERC721Enumerable(_collection).totalSupply(), 0);
    }
}
