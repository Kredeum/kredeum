// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenMarketableTest is OpenNFTsOldTest {
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

    function testFailSetTokenRoyaltyNoToken() public {
        op.setTokenRoyalty(notTokenID, tester, 100);
    }

    function testSetTokenPrice(uint256 price) public {
        vm.assume(price < 2**128);
        op.setTokenPrice(tokenID0, price);
        assertEq(op.tokenPrice(tokenID0), price);
    }

    function testFailSetDefaultPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);
        changePrank(owner);
        op.setDefaultPrice(price);
    }

    function testFailSetTokenPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);
        op.setTokenPrice(tokenID0, price);
    }

    function testFailSetTokenPriceNoToken() public {
        op.setTokenPrice(notTokenID, 1 ether);
    }

    function testRoyaltyInfoCalculation(uint256 price, uint96 fee) public {
        address _collection = address(op);

        vm.assume(price < 2**128);
        vm.assume(fee < maxFee);

        changePrank(owner);
        IOpenMarketable(payable(_collection)).setDefaultRoyalty(minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_collection).royaltyInfo(tokenID0, price);
        assertEq(receiver, minter);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IOpenMarketable).interfaceId));
    }
}
