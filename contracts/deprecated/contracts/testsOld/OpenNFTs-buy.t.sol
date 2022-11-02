// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsBuyTest is OpenNFTsOldTest {
    function testBuyOk() public {
        changePrank(owner);
        IERC721(op).setApprovalForAll(address(op), true);

        op.setTokenRoyalty(tokenID0, tester, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);
        uint256 balOwner = owner.balance;

        assertEq(op.ownerOf(tokenID0), owner);
        op.buy{value: 1.5 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), buyer);

        assertEq(buyer.balance, 9 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(tester.balance, 0.01 ether);
        assertEq(owner.balance, balOwner + 0.99 ether);
    }

    function testFailBuyTwice() public {
        op.setTokenRoyalty(tokenID0, tester, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        op.buy{value: 1 ether}(tokenID0);
        op.buy{value: 1 ether}(tokenID0);
    }

    function testFailBuyNotEnoughFunds() public {
        op.setTokenRoyalty(tokenID0, tester, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        op.buy{value: 0.5 ether}(tokenID0);
    }

    function testFailBuyNotToSell() public {
        op.setTokenPrice(tokenID0, 0);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        op.buy{value: 1 ether}(tokenID0);
    }
}
