// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721Test is OpenNFTsTest {
    function testBalanceOf() public {}

    function testOwnerOf() public {}

    function testSafeTransferFrom() public {}

    function testTransferFrom() public {}

    function testApprove() public {}

    function testSetApprovalForAll() public {}

    function testGetApproved() public {}

    function testIsApprovedForAll() public {}

    function testOnlyTokenOwner() public {
        changePrank(minter);
        op.burn(tokenID0);
    }

    function testNotOnlyTokenOwner() public {
        changePrank(tester);
        vm.expectRevert("Not token owner");
        op.burn(tokenID0);
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IERC721).interfaceId));
    }
}
