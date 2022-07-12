// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsSetupTest is OpenNFTsTest {
    function testContract() public {
        assertEq(op.name(), "OpenNFTsTest");
        assertEq(op.symbol(), "OPTEST");
        assertEq(op.owner(), owner);
        assertEq(op.open(), true);
    }

    function testCount() public {
        assertEq(op.totalSupply(), 1);
        assertEq(op.balanceOf(minter), 1);
        assertEq(op.tokenIdNext(), 2);
    }

    function testToken() public {
        assertEq(op.tokenByIndex(0), 1);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);
        assertEq(op.ownerOf(1), minter);
        assertEq(op.tokenURI(1), _TOKEN_URI);
    }

    function testPrice() public {
        assertEq(op.tokenPrice(1), 0);
    }

    function testRoyalties() public {
        (address receiver, uint256 royalties) = op.royaltyInfo(1, 1);
        assertEq(receiver, address(0));
        assertEq(royalties, 0);
    }
}
