// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTsV4.t.sol";

contract OpenNFTsV4TestOwner is OpenNFTsV4Test {
    function testOwnerAllowed() public {
        changePrank(minter);
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);
    }

    function testOwnerNotAllowed() public {
        changePrank(buyer);

        vm.expectRevert(bytes("Not token owner"));
        op.setTokenRoyalty(tokenID0, random, 100);

        vm.expectRevert(bytes("Not token owner"));
        op.setTokenPrice(tokenID0, 1 ether);
    }
}
