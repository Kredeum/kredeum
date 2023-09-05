// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsBurnTest is OpenNFTsOldTest {
    function testBurn() public {
        uint256 totalSupply = op.totalSupply();
        op.burn(tokenID0);
        assertEq(op.totalSupply(), totalSupply - 1);
    }

    function testFailBurnTokenByIndex() public {
        op.burn(tokenID0);
        op.tokenByIndex(0);
    }

    function testFailBurnTokenOfOwnerByIndex() public {
        op.burn(tokenID0);
        op.tokenOfOwnerByIndex(minter, 0);
    }

    function testBurnSecondOne() public {
        changePrank(tester);
        uint256 tokenID = op.mint(_TOKEN_URI);
        op.burn(tokenID);

        assertEq(op.totalSupply(), 1);
        assertEq(op.tokenByIndex(0), tokenID0);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), tokenID0);
    }

    function testFailBurnSecondOneTokenByIndex() public {
        changePrank(tester);
        uint256 tokenID = op.mint(_TOKEN_URI);
        op.burn(tokenID);
        op.tokenByIndex(1);
    }

    function testFailBurnSecondOneTokenOfOwnerByIndex() public {
        changePrank(tester);
        uint256 tokenID = op.mint(_TOKEN_URI);
        op.burn(tokenID);
        op.tokenOfOwnerByIndex(tester, 0);
    }
}
