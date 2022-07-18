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
    uint256 randNonce;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function burnTest(address collection_, uint256 tokenID_) public virtual;

    function setUpOpenNFTsBurn() public {
        _collection = constructorTest(_owner);

        (_tokenID0, ) = mintTest(_collection, _minter);
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
        (uint256 tokenID, ) = mintTest(_collection, _tester);

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
        (uint256 tokenID, ) = mintTest(_collection, _tester);
        IOpenNFTsV4(_collection).burn(tokenID);
        IERC721Enumerable(_collection).tokenByIndex(1);
    }

    function testFailBurnSecondOneTokennOfOwnerByIndex() public {
        changePrank(_tester);
        (uint256 tokenID, ) = mintTest(_collection, _tester);
        IOpenNFTsV4(_collection).burn(tokenID);
        IERC721Enumerable(_collection).tokenOfOwnerByIndex(_tester, 0);
    }

    function testBurnEnumerable() public {
        assertEq(IERC721Enumerable(_collection).totalSupply(), 1);
        burnTest(_collection, _tokenID0);
        assertEq(IERC721Enumerable(_collection).totalSupply(), 0);
    }

    function testBurnERC721EnumerableShuffleUp(uint160 rnd) public {
        burnTest(_collection, _tokenID0);

        uint160 first = 2**100;
        uint160 total = 20;
        uint256 totalSupply;

        for (uint160 index = 1; index <= total; index++) {
            address address1 = address(first + (random(rnd) % index));
            address address2 = address(first + (random(rnd) % index));
            uint256 rand3 = (random(rnd) % index);

            mintTest(_collection, address1);
            mintTest(_collection, address2);

            uint256 randomTokenID1 = IERC721Enumerable(_collection).tokenByIndex(rand3);
            address owner1 = IERC721(_collection).ownerOf(randomTokenID1);
            changePrank(owner1);
            IERC721(_collection).transferFrom(owner1, address2, randomTokenID1);

            uint256 randomTokenID2 = IERC721Enumerable(_collection).tokenByIndex(uint256(rand3));
            burnTest(_collection, randomTokenID2);

            assertEq(IERC721Enumerable(_collection).totalSupply(), index);
        }
        assertEq(IERC721Enumerable(_collection).totalSupply(), total);

        for (uint160 index = 1; index <= total; index++) {
            totalSupply += IERC721(_collection).balanceOf(address(first + index - 1));
        }
        assertEq(totalSupply, total);
    }

    function random(uint160 rnd) public returns (uint160) {
        randNonce++;
        return uint160(uint256(keccak256(abi.encodePacked(msg.sender, randNonce, rnd))));
    }
}
