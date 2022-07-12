// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenPriceableTest is OpenNFTsTest {
    function testSetDefaultRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        changePrank(owner);
        op.setDefaultRoyalty(tester, fee);

        (address receiver, uint256 royalties) = op.royaltyInfo(tokenID0, price);
        assertEq(receiver, tester);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSetTokenRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        changePrank(minter);
        op.setTokenRoyalty(tokenID0, tester, fee);

        (address receiver, uint256 royalties) = op.royaltyInfo(tokenID0, price);
        assertEq(receiver, tester);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSetTokenRoyaltyNoToken() public {
        vm.expectRevert(bytes("Invalid token ID"));
        op.setTokenRoyalty(notTokenID, tester, 100);
    }

    function testSetTokenPrice(uint256 price) public {
        vm.assume(price < 2**128);
        op.setTokenPrice(tokenID0, price);
        assertEq(op.tokenPrice(tokenID0), price);
    }

    function testSetTokenPriceFromDefault(uint256 price) public {
        vm.assume(price < 2**128);

        changePrank(minter);
        op.setTokenPrice(tokenID0);
        assertEq(op.tokenPrice(tokenID0), 0);

        changePrank(owner);
        op.setDefaultPrice(price);

        changePrank(minter);
        op.setTokenPrice(tokenID0);
        assertEq(op.tokenPrice(tokenID0), price);
    }

    function testSetDefaultPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);

        changePrank(owner);
        vm.expectRevert("Too expensive");
        op.setDefaultPrice(price);
    }

    function testSetTokenPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);
        vm.expectRevert("Too expensive");
        op.setTokenPrice(tokenID0, price);
    }

    function testSetTokenPriceNoToken() public {
        vm.expectRevert(bytes("Invalid token ID"));
        op.setTokenPrice(notTokenID, 1 ether);
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IOpenPriceable).interfaceId));
    }
}
