// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC173Text is OpenNFTsTest {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function testInitialize() public {
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        assertEq(opn.owner(), owner);
    }

    function testInitializeTwice() public {
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        vm.expectRevert("Only once!");
        opn.initialize("OpenNFTsTest", "OPTEST", tester, options);
        assertEq(opn.owner(), owner);
    }

    function testOwner() public {
        assertEq(op.owner(), owner);
    }

    function testOnlyOwner() public {
        changePrank(owner);
        op.togglePause();
    }

    function testNotOnlyOwner() public {
        changePrank(tester);
        vm.expectRevert("Not owner");
        op.togglePause();
    }

    function testTransferOwnership() public {
        changePrank(owner);
        op.transferOwnership(tester);
        assertEq(op.owner(), tester);
    }

    function testEmitTransferOwnership() public {
        changePrank(owner);
        vm.expectEmit(true, true, false, false);
        emit OwnershipTransferred(owner, tester);
        op.transferOwnership(tester);
    }

    function testNotTransferOwnership() public {
        changePrank(tester);
        vm.expectRevert("Not owner");
        op.transferOwnership(minter);
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IERC173).interfaceId));
    }
}
