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
    address private _buyer = address(0x1004);
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

        if (_transferable) {
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
        }
    }

    function testERC721SafeTransferFromWithData() public {
        changePrank(_minter);

        if (_transferable) {
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
        }
    }

    function testERC721SafeTransferFromEmit() public {
        changePrank(_minter);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(_minter, _tester, 1);
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
        }
    }

    function testERC721SafeTransferFromWithDataEmit() public {
        changePrank(_minter);

        if (_transferable) {
            vm.expectEmit(true, true, true, false);
            emit Transfer(_minter, _tester, 1);
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
        }
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
            IERC721(_collection).safeTransferFrom(from, to, tokenID);
            assertEq(IERC721(_collection).ownerOf(tokenID), to);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).safeTransferFrom(from, to, tokenID);
        }
    }

    function testFailERC721SafeTransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, address(_collection), _tokenID0);
    }

    function testERC721TransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);

        if (_transferable) {
            IERC721(_collection).transferFrom(_minter, address(_collection), _tokenID0);
            assertEq(IERC721(_collection).ownerOf(_tokenID0), address(_collection));
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).transferFrom(_minter, address(_collection), _tokenID0);
        }
    }

    function testERC721TransferFrom() public {
        changePrank(_minter);

        if (_transferable) {
            IERC721(_collection).transferFrom(_minter, _tester, _tokenID0);
            assertEq(IERC721(_collection).ownerOf(1), _tester);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).transferFrom(_minter, _tester, _tokenID0);
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
            IERC721(_collection).transferFrom(from, to, tokenID);
            assertEq(IERC721(_collection).ownerOf(tokenID), to);
        } else {
            vm.expectRevert("Non transferable NFT");
            IERC721(_collection).transferFrom(from, to, tokenID);
        }
    }

    function testFailERC721NotOnlyTokenOwner() public {
        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testERC721Approve() public {
        if (_transferable) {
            changePrank(_minter);
            vm.expectEmit(true, true, true, false);
            emit Approval(_minter, _tester, _tokenID0);
            IERC721(_collection).approve(_tester, _tokenID0);

            changePrank(_tester);
            IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);
        }
    }

    function testFailERC721Approve() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);
        IERC721(_collection).approve(address(0), _tokenID0);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
    }

    function testERC721GetApproved() public {
        if (_transferable) {
            changePrank(_minter);
            IERC721(_collection).approve(_tester, _tokenID0);

            assertEq(IERC721(_collection).getApproved(_tokenID0), _tester);
        }
    }

    function testFailERC721GetApproved() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);
        IERC721(_collection).approve(_buyer, _tokenID0);

        assertEq(IERC721(_collection).getApproved(_tokenID0), _tester);
    }

    function testERC721SetApprovalForAll() public {
        if (_transferable) {
            changePrank(_minter);
            vm.expectEmit(true, true, true, false);
            emit ApprovalForAll(_minter, _tester, true);
            IERC721(_collection).setApprovalForAll(_tester, true);

            changePrank(_tester);
            IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
            assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);
        }
    }

    function testFailERC721SetApprovalForAll() public {
        changePrank(_tester);
        IERC721(_collection).setApprovalForAll(_tester, true);
        IERC721(_collection).setApprovalForAll(_tester, false);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
    }

    function testERC721IsApprovedForAll() public {
        if (_transferable) {
            changePrank(_minter);
            IERC721(_collection).setApprovalForAll(_tester, true);
            assertTrue(IERC721(_collection).isApprovedForAll(_minter, _tester));
        }
    }

    function testERC721IsNotApprovedForAll() public {
        if (_transferable) {
            changePrank(_minter);
            IERC721(_collection).setApprovalForAll(_tester, true);
            IERC721(_collection).setApprovalForAll(_tester, false);
        }
        assertFalse(IERC721(_collection).isApprovedForAll(_minter, _tester));
    }

    function testERC721SupportsInterface() public {
        assertTrue(IERC165(address(_collection)).supportsInterface(type(IERC721).interfaceId));
    }
}
