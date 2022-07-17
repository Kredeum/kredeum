// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenPausableTest is OpenNFTsOldTest {
    event SetPaused(bool indexed paused, address indexed account);

    function testOnlyWhenNotPaused() public {
        changePrank(minter);
        op.mint(_TOKEN_URI);
    }

    function testFailOnlyWhenNotPaused() public {
        changePrank(minter);
        op.togglePause();
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

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IOpenPausable).interfaceId));
    }
}
