// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsTokenOwnerTest is OpenNFTsOldTest {
    function testTokenOwner() public {
        changePrank(minter);
        op.setTokenRoyalty(tokenID0, tester, 100);
        op.setTokenPrice(tokenID0, 1 ether);
    }

    function testTokenOwnerNotOwner() public {
        changePrank(buyer);

        vm.expectRevert(bytes("Not token owner"));
        op.setTokenRoyalty(tokenID0, tester, 100);

        vm.expectRevert(bytes("Not token owner"));
        op.setTokenPrice(tokenID0, 1 ether);
    }
}
