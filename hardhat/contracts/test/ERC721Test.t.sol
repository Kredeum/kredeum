// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC165.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Events.sol";
import "../interfaces/IOpenNFTsV4.sol";

abstract contract ERC721Test is Test, IERC721Events {
    address private _collection;
    bool private _transferable;
    string private _tokenURI;
    address private _owner = address(0x1001);
    address private _minter = address(0x1002);
    address private _tester = address(0x1004);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256);

    function burnTest(address collection_, uint256 tokenID_) public virtual;

    function setUpERC721(bool nonTransferable_) public {
        _transferable = nonTransferable_;
        _collection = constructorTest(_owner);

        _tokenID0 = mintTest(_collection, _minter);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
    }

    function testERC721BalanceOf() public {
        assertEq(IERC721(_collection).balanceOf(_minter), 1);
        assertEq(IERC721(_collection).balanceOf(_tester), 0);
    }

    function testERC721BalanceOfBis() public {
        mintTest(_collection, _tester);
        assertEq(IERC721(_collection).balanceOf(_tester), 1);
    }

    function testERC721OwnerOf() public {
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
    }

    function testERC721OwnerOfBis() public {
        uint256 tokenID = mintTest(_collection, _tester);
        assertEq(IERC721(_collection).ownerOf(tokenID), _tester);
    }

    function testERC721SafeTransferFrom() public {
        changePrank(_minter);

        if (!_transferable) {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
        }
    }

    function testERC721SafeTransferFromWithData() public {
        changePrank(_minter);

        if (!_transferable) {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
        }
    }

    function testERC721SafeTransferFromEmit() public {
        changePrank(_minter);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(_minter, _tester, 1);
        } else {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testERC721SafeTransferFromWithDataEmit() public {
        changePrank(_minter);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(_minter, _tester, 1);
        } else {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
    }

    function testERC721SafeTransferFromFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        uint256 tokenID = mintTest(_collection, from);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(from, to, 2);
        } else {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).safeTransferFrom(from, to, tokenID);

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(tokenID), to);
        }
    }

    function testFailERC721SafeTransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, address(_collection), _tokenID0);
    }

    function testERC721TransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);

        if (!_transferable) {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).transferFrom(_minter, address(_collection), _tokenID0);

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(_tokenID0), address(_collection));
        }
    }

    function testERC721TransferFrom() public {
        changePrank(_minter);

        if (!_transferable) {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).transferFrom(_minter, _tester, _tokenID0);

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(1), _tester);
        }
    }

    function testERC721TransferFromFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        uint256 tokenID = mintTest(_collection, from);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(from, to, 2);
        } else {
            vm.expectRevert("Non transferable NFT");
        }

        IERC721(_collection).transferFrom(from, to, tokenID);

        if (_transferable) {
            assertEq(IERC721(_collection).ownerOf(tokenID), to);
        }
    }

    function testERC721Approve() public {}

    function testERC721SetApprovalForAll() public {}

    function testERC721GetApproved() public {}

    function testERC721IsApprovedForAll() public {}

    function testERC721OnlyTokenOwner() public {}

    function testFailERC721NotOnlyTokenOwner() public {
        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testERC721SupportsInterface() public {
        assertTrue(IERC165(address(_collection)).supportsInterface(type(IERC721).interfaceId));
    }
}
