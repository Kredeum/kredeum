// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC173Text is OpenNFTsOldTest {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function testInitialize() public {
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, options);
        assertEq(opn.owner(), owner);
    }

    function testFailInitializeTwice() public {
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, options);
        opn.initialize("OpenNFTsOldTest", "OPTEST", tester, options);
    }

    function testOwner() public {
        assertEq(op.owner(), owner);
    }

    function testOnlyOwner() public {
        changePrank(owner);
        op.togglePause();
    }

    function testFailOnlyOwner() public {
        changePrank(tester);
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

    function testFailTransferOwnership() public {
        changePrank(tester);
        op.transferOwnership(minter);
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IERC173).interfaceId));
    }
}
