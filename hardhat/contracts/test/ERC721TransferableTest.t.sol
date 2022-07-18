// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC165.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Events.sol";
import "../interfaces/IOpenNFTsV4.sol";

import "../open/OpenERC721TokenReceiver.sol";

abstract contract ERC721TransferableTest is Test, IERC721Events {
    address private _collection;
    string private _tokenURI;
    address private _owner = address(0x1001);
    address private _minter = address(0x1002);
    address private _buyer = address(0x1003);
    address private _tester = address(0x1004);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function setUpERC721Transferable() public {
        _collection = constructorTest(_owner);

        (_tokenID0, ) = mintTest(_collection, _minter);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
    }

    function testERC721SafeTransferFrom() public {
        changePrank(_minter);

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
    }

    function testERC721SafeTransferFromWithData() public {
        changePrank(_minter);

        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _tester);
    }

    function testERC721SafeTransferFromEmit() public {
        changePrank(_minter);

        vm.expectEmit(true, true, true, false);
        emit Transfer(_minter, _tester, 1);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testERC721SafeTransferFromWithDataEmit() public {
        changePrank(_minter);

        vm.expectEmit(true, true, true, false);
        emit Transfer(_minter, _tester, 1);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0, "data");
    }

    function testERC721SafeTransferFromEOAFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        (uint256 tokenID, ) = mintTest(_collection, from);

        vm.expectEmit(true, true, true, false);
        emit Transfer(from, to, 2);
        IERC721(_collection).safeTransferFrom(from, to, tokenID);
        assertEq(IERC721(_collection).ownerOf(tokenID), to);
    }

    function testERC721TransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);

        IERC721(_collection).transferFrom(_minter, address(_collection), _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), address(_collection));
    }

    function testERC721TransferFrom() public {
        changePrank(_minter);

        IERC721(_collection).transferFrom(_minter, _tester, _tokenID0);
        assertEq(IERC721(_collection).ownerOf(1), _tester);
    }

    function testERC721TransferFromEOAFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        (uint256 tokenID, ) = mintTest(_collection, from);

        vm.expectEmit(true, true, true, false);
        emit Transfer(from, to, 2);
        IERC721(_collection).transferFrom(from, to, tokenID);
        assertEq(IERC721(_collection).ownerOf(tokenID), to);
    }

    function testERC721transferFromToContract() public {
        changePrank(_minter);
        IERC721(_collection).transferFrom(_minter, address(this), _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), address(this));
    }

    function testFailERC721SafeTransferFromToNotReceiverContract() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, address(this), _tokenID0);
    }

    function testERC721SafeTransferFromToReceiverContract() public {
        OpenERC721TokenReceiver receiverContract = new OpenERC721TokenReceiver();

        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, address(receiverContract), _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), address(receiverContract));
    }

    function testERC721Approve() public {
        changePrank(_minter);
        vm.expectEmit(true, true, true, false);
        emit Approval(_minter, _tester, _tokenID0);
        IERC721(_collection).approve(_tester, _tokenID0);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);
    }

    function testERC721SetApprovalForAll() public {
        changePrank(_minter);
        vm.expectEmit(true, true, true, false);
        emit ApprovalForAll(_minter, _tester, true);
        IERC721(_collection).setApprovalForAll(_tester, true);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);
    }

    function testFailERC721TransferFromToZeroAddress() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, address(0), _tokenID0);
    }

    function testFailERC721TransferFromFromZeroAddress() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(address(0), _tester, _tokenID0);
    }

    function testERC721TransferFromToSameAddress() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, _minter, _tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
    }
}
