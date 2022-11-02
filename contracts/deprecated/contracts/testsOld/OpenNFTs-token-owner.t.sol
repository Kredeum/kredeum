// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsTokenOwnerTest is OpenNFTsOldTest {
    function testTokenOwner() public {
        changePrank(minter);
        op.setTokenRoyalty(tokenID0, tester, 100);
        op.setTokenPrice(tokenID0, 1 ether);
    }

    function testFailSetTokenRoyaltyNotOwner() public {
        changePrank(buyer);
        op.setTokenRoyalty(tokenID0, tester, 100);
    }

    function testFailSetTokenPriceNotOwner() public {
        changePrank(buyer);
        op.setTokenPrice(tokenID0, 1 ether);
    }
}
