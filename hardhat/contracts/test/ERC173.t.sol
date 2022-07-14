// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";

abstract contract ERC173Test is Test {
    address private _contract;
    string private _tokenURI;
    address private owner = address(0x1);
    address private minter = address(0x12);
    address private tester = address(0x4);
    uint256 private _tokenID0;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpERC173() public {
        _contract = constructorTest(owner);
    }

    function testERC173Owner() public {
        assertEq(IERC173(_contract).owner(), owner);
    }

    function testERC173OnlyOwner() public {
        changePrank(owner);
        IERC173(_contract).transferOwnership(tester);
    }

    function testFailERC173NotOnlyOwner() public {
        changePrank(tester);
        IERC173(_contract).transferOwnership(minter);
    }

    function testERC173TransferOwnership() public {
        changePrank(owner);
        IERC173(_contract).transferOwnership(tester);
        assertEq(IERC173(_contract).owner(), tester);
    }

    function testERC173EmitTransferOwnership() public {
        changePrank(owner);
        vm.expectEmit(true, true, false, false);
        emit OwnershipTransferred(owner, tester);
        IERC173(_contract).transferOwnership(tester);
    }

    function testFailERC173NotTransferOwnership() public {
        changePrank(tester);
        IERC173(_contract).transferOwnership(minter);
    }

    function testERC173SupportsInterface() public {
        assertTrue(IERC165(address(_contract)).supportsInterface(type(IERC173).interfaceId));
    }
}
