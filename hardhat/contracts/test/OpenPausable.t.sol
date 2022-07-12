// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenPausableTest is OpenNFTsTest {
    event SetPaused(bool indexed paused, address indexed account);

    function testOnlyWhenNotPaused() public {
        changePrank(minter);
        op.mint(_TOKEN_URI);

        vm.expectRevert(bytes("Not owner"));
        op.togglePause();

        changePrank(owner);
        op.togglePause();

        changePrank(minter);
        vm.expectRevert(bytes("Paused!"));
        op.mint(_TOKEN_URI);
    }

    function testTogglePause() public {
        changePrank(owner);
        assertEq(op.paused(), false);

        op.togglePause();
        assertEq(op.paused(), true);

        op.togglePause();
        assertEq(op.paused(), false);
    }

    function testEmitSetPause() public {
        changePrank(owner);

        vm.expectEmit(true, true, false, false);
        emit SetPaused(true, owner);
        op.togglePause();

        vm.expectEmit(true, true, false, false);
        emit SetPaused(false, owner);
        op.togglePause();
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IOpenPausable).interfaceId));
    }
}
