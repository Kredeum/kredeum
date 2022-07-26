// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721EnumerableTest is OpenNFTsOldTest {
    function testTotalSupply() public {
        assertEq(op.totalSupply(), 1);
        op.mint(_TOKEN_URI);
        assertEq(op.totalSupply(), 2);
        op.mint(_TOKEN_URI);
        assertEq(op.totalSupply(), 3);
    }

    function testTokenByIndex() public {
        assertEq(op.tokenByIndex(0), 1);
        op.mint(_TOKEN_URI);
        assertEq(op.tokenByIndex(1), 2);
    }

    function testTokenOfOwnerByIndex() public {
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);
        op.mint(_TOKEN_URI);
        assertEq(op.tokenOfOwnerByIndex(minter, 1), 2);
        changePrank(tester);
        op.mint(_TOKEN_URI);
        assertEq(op.tokenOfOwnerByIndex(minter, 1), 2);
        assertEq(op.tokenOfOwnerByIndex(tester, 0), 3);
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IERC721Enumerable).interfaceId));
    }
}
