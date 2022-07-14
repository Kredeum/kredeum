// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IOpenPausable.sol";

abstract contract OpenPausableTest is Test {
    address private _contract;
    address private owner = address(0x1);
    address private minter = address(0x2);
    address private tester = address(0x4);

    event SetPaused(bool indexed paused, address indexed account);

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256);

    function setUpPausable() public {
        _contract = constructorTest(owner);
    }

    function testPausable() public {
        assertEq(IOpenPausable(_contract).paused(), false);
    }

    function testPausableTogglePause() public {
        changePrank(owner);

        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), true);

        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), false);
    }

    function testFailPausableTogglePauseNotOwner() public {
        changePrank(tester);
        IOpenPausable(_contract).togglePause();
    }

    function testFailPausableOnlyWhenNotPaused() public {
        changePrank(owner);
        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), true);

        mintTest(_contract, owner);
    }

    function testPausableEmitSetPause() public {
        changePrank(owner);

        vm.expectEmit(true, true, false, false);
        emit SetPaused(true, owner);
        IOpenPausable(_contract).togglePause();

        vm.expectEmit(true, true, false, false);
        emit SetPaused(false, owner);
        IOpenPausable(_contract).togglePause();
    }

    function testPausableSupportsInterface() public {
        assertTrue(IERC165(_contract).supportsInterface(type(IOpenPausable).interfaceId));
    }
}
