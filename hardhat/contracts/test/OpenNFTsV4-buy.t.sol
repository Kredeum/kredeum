// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTsV4.t.sol";

contract OpenNFTsV4TestBuy is OpenNFTsV4Test {
    function testBuyOk() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);
        uint256 balMinter = minter.balance;

        assertEq(op.ownerOf(tokenID0), minter);
        op.buy{value: 1.5 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), buyer);

        assertEq(buyer.balance, 9 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(random.balance, 0.01 ether);
        assertEq(minter.balance, balMinter + 0.99 ether);
    }

    function testBuyTwice() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        op.buy{value: 1 ether}(tokenID0);
        vm.expectRevert(bytes("Not to sell"));
        op.buy{value: 1 ether}(tokenID0);
    }

    function testBuyNotEnoughFunds() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        vm.expectRevert(bytes("Not enough funds"));
        op.buy{value: 0.5 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), minter);

        assertEq(buyer.balance, 10 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(random.balance, 0 ether);
    }

    function testBuyNotToSell() public {
        op.setTokenPrice(tokenID0, 0);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        vm.expectRevert(bytes("Not to sell"));
        op.buy{value: 1 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), minter);

        assertEq(buyer.balance, 10 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(random.balance, 0 ether);
    }

    function testSetTokenRoyaltyNoToken() public {
        vm.expectRevert(bytes("ERC721: owner query for nonexistent token"));
        op.setTokenRoyalty(notTokenID, random, 100);
    }

    function testSetTokenPriceNoToken() public {
        vm.expectRevert(bytes("ERC721: owner query for nonexistent token"));
        op.setTokenPrice(notTokenID, 1 ether);
    }

    function testRoyaltyInfoOverFlow() public {
        changePrank(owner);
        op.setDefaultRoyalty(minter, maxFee);

        op.royaltyInfo(tokenID0, maxPrice);
        vm.expectRevert(stdError.arithmeticError);
        op.royaltyInfo(tokenID0, maxPrice * 2);
    }

    function testRoyaltyInfo(uint256 price, uint96 fee) public {
        // Assume reasonable max price
        vm.assume(fee < maxFee);
        vm.assume(price < maxPrice);

        changePrank(owner);
        op.setDefaultRoyalty(minter, fee);

        (address creator, uint256 royalties) = op.royaltyInfo(tokenID0, price);
        assertEq(creator, minter);
        assertEq(royalties, (price * fee) / maxFee);
    }
}
