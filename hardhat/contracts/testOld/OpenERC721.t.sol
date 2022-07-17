// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721Test is OpenNFTsOldTest {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenID);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function testBalanceOf() public {
        assertEq(op.balanceOf(minter), 1);
        assertEq(op.balanceOf(tester), 0);
    }

    function testOwnerOf() public {
        assertEq(op.ownerOf(1), minter);
        op.mint(_TOKEN_URI);
        assertEq(op.ownerOf(2), minter);
    }

    function testSafeTransferFrom() public {
        op.safeTransferFrom(minter, tester, 1);
        assertEq(op.ownerOf(1), tester);
    }

    function testSafeTransferFromWithData() public {
        op.safeTransferFrom(minter, tester, 1, "data");
        assertEq(op.ownerOf(1), tester);
    }

    function testSafeTransferFromEmit() public {
        vm.expectEmit(true, true, true, false);
        emit Transfer(minter, tester, 1);
        op.safeTransferFrom(minter, tester, 1);
    }

    function testSafeTransferFromWithDataEmit() public {
        vm.expectEmit(true, true, true, false);
        emit Transfer(minter, tester, 1);
        op.safeTransferFrom(minter, tester, 1, "data");
    }

    function testSafeTransferFromFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        changePrank(from);
        op.mint(_TOKEN_URI);
        vm.expectEmit(true, true, true, false);
        emit Transfer(from, to, 2);
        op.safeTransferFrom(from, to, 2);
        assertEq(op.ownerOf(2), to);
    }

    function testFailSafeTransferFromNotERC721TokenReceiver() public {
        op.safeTransferFrom(minter, address(op), 1);
    }

    function testTransferFromNotERC721TokenReceiver() public {
        op.transferFrom(minter, address(op), 1);
        assertEq(op.ownerOf(1), address(op));
    }

    function testTransferFrom() public {
        op.transferFrom(minter, tester, 1);
        assertEq(op.ownerOf(1), tester);
    }

    function testTransferFromFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        changePrank(from);
        op.mint(_TOKEN_URI);
        vm.expectEmit(true, true, true, false);
        emit Transfer(from, to, 2);
        op.transferFrom(from, to, 2);
        assertEq(op.ownerOf(2), to);
    }

    function testOnlyTokenOwner() public {
        changePrank(minter);
        op.burn(tokenID0);
    }

    function testFailOnlyTokenOwner() public {
        changePrank(tester);
        op.burn(tokenID0);
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IERC721).interfaceId));
    }
}
