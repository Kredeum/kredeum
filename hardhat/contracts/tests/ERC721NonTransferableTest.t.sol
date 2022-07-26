// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Events.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTsV4.sol";

abstract contract ERC721NonTransferableTest is Test, IERC721Events {
    address private _collection;
    bool private _transferable;
    string private _tokenURI;
    address private _owner = address(0x1001);
    address private _minter = address(0x1002);
    address private _buyer = address(0x1003);
    address private _tester = address(0x1004);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_)
        public
        virtual
        returns (uint256, string memory);

    function burnTest(address collection_, uint256 tokenID_) public virtual;

    function setUpERC721NonTransferable() public {
        _transferable = false;
        _collection = constructorTest(_owner);

        (_tokenID0, ) = mintTest(_collection, _minter);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
    }

    function testFailERC721SafeTransferFrom() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(_minter, _tester, _tokenID0);
    }

    function testFailERC721SafeTransferFromWithData() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(
            _minter,
            _tester,
            _tokenID0,
            "data"
        );
    }

    function testFailERC721SafeTransferFromFuzzy(address from, address to)
        public
    {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        (uint256 tokenID, ) = mintTest(_collection, from);
        IERC721(_collection).safeTransferFrom(from, to, tokenID);
    }

    function testFailERC721SafeTransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);
        IERC721(_collection).safeTransferFrom(
            _minter,
            address(_collection),
            _tokenID0
        );
    }

    function testFailERC721TransferFromNotERC721TokenReceiver() public {
        changePrank(_minter);
        IERC721(_collection).transferFrom(
            _minter,
            address(_collection),
            _tokenID0
        );
    }

    function testFailERC721TransferFrom() public {
        changePrank(_minter);
        IERC721(_collection).transferFrom(_minter, _tester, _tokenID0);
    }

    function testFailERC721TransferFromFuzzy(address from, address to) public {
        vm.assume(from != address(0));
        vm.assume(to != address(0));
        vm.assume(to != from);
        vm.assume(from.code.length == 0);
        vm.assume(to.code.length == 0);

        (uint256 tokenID, ) = mintTest(_collection, from);
        IERC721(_collection).transferFrom(from, to, tokenID);
    }

    function testFailERC721Approve() public {
        changePrank(_minter);
        IERC721(_collection).approve(_tester, _tokenID0);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
    }

    function testFailERC721SetApprovalForAll() public {
        changePrank(_minter);
        IERC721(_collection).setApprovalForAll(_tester, true);

        changePrank(_tester);
        IERC721(_collection).safeTransferFrom(_minter, _buyer, _tokenID0);
    }
}
