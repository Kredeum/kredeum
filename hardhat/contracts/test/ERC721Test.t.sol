// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC165.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Events.sol";
import "../interfaces/IOpenNFTsV4.sol";

abstract contract ERC721Test is Test, IERC721Events {
    address private _collection;
    string private _tokenURI;
    address private _owner = address(0x1001);
    address private _minter = address(0x1002);
    address private _buyer = address(0x1003);
    address private _tester = address(0x1004);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function burnTest(address collection_, uint256 tokenID_) public virtual;

    function setUpERC721() public {
        _collection = constructorTest(_owner);

        (_tokenID0, ) = mintTest(_collection, _minter);
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
        (uint256 tokenID, ) = mintTest(_collection, _tester);
        assertEq(IERC721(_collection).ownerOf(tokenID), _tester);
    }

    function testFailERC721NotOnlyTokenOwner() public {
        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testFailERC721ApproveChange() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);
        IERC721(_collection).approve(address(0), _tokenID0);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
    }

    function testERC721GetApproved() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);

        assertEq(IERC721(_collection).getApproved(_tokenID0), _tester);
    }

    function testFailERC721GetApproved() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);
        IERC721(_collection).approve(_buyer, _tokenID0);

        assertEq(IERC721(_collection).getApproved(_tokenID0), _tester);
    }

    function testERC721IsApprovedForAll() public {
        changePrank(_minter);
        IERC721(_collection).setApprovalForAll(_tester, true);
        assertTrue(IERC721(_collection).isApprovedForAll(_minter, _tester));
    }

    function testERC721IsNotApprovedForAll() public {
        changePrank(_minter);
        IERC721(_collection).setApprovalForAll(_tester, true);
        IERC721(_collection).setApprovalForAll(_tester, false);

        assertFalse(IERC721(_collection).isApprovedForAll(_minter, _tester));
    }

    function testERC721SupportsInterface() public {
        assertTrue(IERC165(address(_collection)).supportsInterface(type(IERC721).interfaceId));
    }
}
