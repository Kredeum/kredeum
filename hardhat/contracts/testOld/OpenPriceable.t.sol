// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenPriceableTest is OpenNFTsOldTest {
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

    function testSetTokenPriceFromDefault(uint256 price) public {
        vm.assume(price < 2**128);
        vm.assume(price != 0);

        changePrank(minter);
        op.setTokenPrice(tokenID0);
        assertEq(op.tokenPrice(tokenID0), 0);

        changePrank(owner);
        op.setDefaultPrice(price);

        changePrank(minter);
        op.setTokenPrice(tokenID0);
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
        address _contract = address(op);

        vm.assume(price < 2**128);
        vm.assume(fee < maxFee);

        changePrank(owner);
        IOpenPriceable(_contract).setDefaultRoyalty(minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(tokenID0, price);
        assertEq(receiver, minter);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IOpenPriceable).interfaceId));
    }
}
