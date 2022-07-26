// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IOpenPauseable.sol";

abstract contract OpenPauseableTest is Test {
    address private _contract;
    address private _owner = address(0x1);
    address private _tester = address(0x4);

    event SetPaused(bool indexed paused, address indexed account);

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_)
        public
        virtual
        returns (uint256, string memory);

    function setUpPausable() public {
        _contract = constructorTest(_owner);
    }

    function testPausable() public {
        assertEq(IOpenPauseable(_contract).paused(), false);
    }

    function testPausableTogglePause() public {
        changePrank(_owner);

        IOpenPauseable(_contract).togglePause();
        assertEq(IOpenPauseable(_contract).paused(), true);

        IOpenPauseable(_contract).togglePause();
        assertEq(IOpenPauseable(_contract).paused(), false);
    }

    function testFailPausableTogglePauseNotOwner() public {
        changePrank(_tester);
        IOpenPauseable(_contract).togglePause();
    }

    function testFailPausableOnlyWhenNotPaused() public {
        changePrank(_owner);
        IOpenPauseable(_contract).togglePause();
        assertEq(IOpenPauseable(_contract).paused(), true);

        mintTest(_contract, _owner);
    }

    function testPausableEmitSetPause() public {
        changePrank(_owner);

        vm.expectEmit(true, true, false, false);
        emit SetPaused(true, _owner);
        IOpenPauseable(_contract).togglePause();

        vm.expectEmit(true, true, false, false);
        emit SetPaused(false, _owner);
        IOpenPauseable(_contract).togglePause();
    }

    function testPausableSupportsInterface() public {
        assertTrue(
            IERC165(_contract).supportsInterface(
                type(IOpenPauseable).interfaceId
            )
        );
    }
}
