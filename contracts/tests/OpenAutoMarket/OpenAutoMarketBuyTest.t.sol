// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import "src/interfaces/IOpenAutoMarket.sol";

abstract contract OpenAutoMarketBuyTest is Test {
    address payable private _collection;
    address private _owner = makeAddr("owner");
    address private _buyer = makeAddr("buyer");
    address private _tester = makeAddr("tester");
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256, string memory);

    function setUpOpenNFTsBuy() public {
        _collection = payable(constructorTest(_owner));

        (_tokenID0,) = mintTest(_collection, _owner);
    }

    function testBuyOk() public {
        changePrank(_owner);
        IERC721(_collection).setApprovalForAll(_collection, true);

        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        assertEq(IERC721(_collection).ownerOf(_tokenID0), _owner);
        IOpenAutoMarket(_collection).buy{value: 1.5 ether}(_tokenID0);
        assertEq(IERC721(_collection).ownerOf(_tokenID0), _buyer);

        assertEq(_buyer.balance, 9 ether);
        assertEq(_collection.balance, 0 ether);
        assertEq(_tester.balance, 0.01 ether);
        assertEq(_owner.balance, 0.981 ether);
        assertEq(makeAddr("treasury").balance, 0.009 ether);
    }

    function testFailBuyTwice() public {
        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        IOpenAutoMarket(_collection).buy{value: 1 ether}(_tokenID0);
        IOpenAutoMarket(_collection).buy{value: 1 ether}(_tokenID0);
    }

    function testFailBuyNotEnoughFunds() public {
        IOpenMarketable(_collection).setTokenRoyalty(_tokenID0, _tester, 100);
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 1 ether);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        IOpenAutoMarket(_collection).buy{value: 0.5 ether}(_tokenID0);
    }

    function testFailBuyNotToSell() public {
        IOpenMarketable(_collection).setTokenPrice(_tokenID0, 0);

        changePrank(_buyer);
        deal(_buyer, 10 ether);

        assertEq(IERC721(_collection).ownerOf(_tokenID0), _owner);
        IOpenAutoMarket(_collection).buy{value: 1 ether}(_tokenID0);
    }
}
