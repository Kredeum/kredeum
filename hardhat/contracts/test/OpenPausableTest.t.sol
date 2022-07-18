// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IOpenPausable.sol";

abstract contract OpenPausableTest is Test {
    address private _contract;
    address private _owner = address(0x1);
    address private _tester = address(0x4);

    event SetPaused(bool indexed paused, address indexed account);

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function setUpPausable() public {
        _contract = constructorTest(_owner);
    }

    function testPausable() public {
        assertEq(IOpenPausable(_contract).paused(), false);
    }

    function testPausableTogglePause() public {
        changePrank(_owner);

        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), true);

        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), false);
    }

    function testFailPausableTogglePauseNotOwner() public {
        changePrank(_tester);
        IOpenPausable(_contract).togglePause();
    }

    function testFailPausableOnlyWhenNotPaused() public {
        changePrank(_owner);
        IOpenPausable(_contract).togglePause();
        assertEq(IOpenPausable(_contract).paused(), true);

        mintTest(_contract, _owner);
    }

    function testPausableEmitSetPause() public {
        changePrank(_owner);

        vm.expectEmit(true, true, false, false);
        emit SetPaused(true, _owner);
        IOpenPausable(_contract).togglePause();

        vm.expectEmit(true, true, false, false);
        emit SetPaused(false, _owner);
        IOpenPausable(_contract).togglePause();
    }

    function testPausableSupportsInterface() public {
        assertTrue(IERC165(_contract).supportsInterface(type(IOpenPausable).interfaceId));
    }
}
