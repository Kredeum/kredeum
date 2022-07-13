// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsBurnTest is OpenNFTsTest {
    function testBurn() public {
        assertEq(op.totalSupply(), 1);
        assertEq(op.tokenByIndex(0), 1);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);

        op.burn(1);

        assertEq(op.totalSupply(), 0);
        vm.expectRevert("Invalid index!");
        op.tokenByIndex(0);
        vm.expectRevert("Invalid index!");
        op.tokenOfOwnerByIndex(minter, 0);
    }

    function testBurnSecondOne() public {
        changePrank(tester);
        op.mint(_TOKEN_URI);

        assertEq(op.totalSupply(), 2);
        assertEq(op.tokenByIndex(0), 1);
        assertEq(op.tokenByIndex(1), 2);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);
        assertEq(op.tokenOfOwnerByIndex(tester, 0), 2);

        op.burn(2);

        assertEq(op.totalSupply(), 1);
        assertEq(op.tokenByIndex(0), 1);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);

        vm.expectRevert("Invalid index!");
        op.tokenByIndex(1);
        vm.expectRevert("Invalid index!");
        op.tokenOfOwnerByIndex(tester, 0);
    }
}
