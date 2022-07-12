// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC2981Test is OpenNFTsTest {
    function testRoyaltyInfo(uint256 price) public {
        vm.assume(price < 2**128);
        op.royaltyInfo(tokenID0, price);
    }

    function testRoyaltyInfoTooExpensive(uint256 price) public {
        vm.assume(price >= 2**128);
        vm.expectRevert("Too expensive");
        op.royaltyInfo(tokenID0, price);
    }

    function testRoyaltyInfoCalculation(uint256 price, uint96 fee) public {
        vm.assume(price < 2**128);
        vm.assume(fee < maxFee);

        changePrank(owner);
        op.setDefaultRoyalty(minter, fee);

        (address receiver, uint256 royalties) = op.royaltyInfo(tokenID0, price);
        assertEq(receiver, minter);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IERC2981).interfaceId));
    }
}
