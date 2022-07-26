// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTsV4.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";

abstract contract OpenNFTsBuyTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_)
        public
        virtual
        returns (uint256, string memory);

    function setUpOpenNFTsBuy() public {
        _collection = constructorTest(_owner);

        (_tokenID0, ) = mintTest(_collection, _minter);
    }

    function testBuyOk() public {
        changePrank(_minter);
        IERC721(_collection).setApprovalForAll(_collection, true);

        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);
        uint256 balMinter = _minter.balance;

        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
        IOpenNFTsV4(_collection).buy{value: 1.5 ether}(_tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);

        assertEq(_buyer.balance, 9 ether);
        assertEq(_collection.balance, 0 ether);
        assertEq(_tester.balance, 0.01 ether);
        assertEq(_minter.balance, balMinter + 0.99 ether);
    }

    function testFailBuyTwice() public {
        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        IOpenNFTsV4(_collection).buy{value: 1 ether}(_tokenID0);
        IOpenNFTsV4(_collection).buy{value: 1 ether}(_tokenID0);
    }

    function testFailBuyNotEnoughFunds() public {
        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        IOpenNFTsV4(_collection).buy{value: 0.5 ether}(_tokenID0);
    }

    function testFailBuyNotToSell() public {
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 0);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        assertEq(IERC721(_collection).ownerOf(_tokenID0), _minter);
        IOpenNFTsV4(_collection).buy{value: 1 ether}(_tokenID0);
    }
}
