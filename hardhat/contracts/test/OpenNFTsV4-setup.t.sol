// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTsV4.t.sol";

contract OpenNFTsV4TestSetup is OpenNFTsV4Test {
    function testSetupContract() public {
        // assertEq(op.name(), "OpenNFTsV4Test");
        assertEq(op.symbol(), "OPTEST");
        assertEq(op.owner(), owner);
        assertEq(op.open(), true);
    }

    function testSetupCount() public {
        assertEq(op.totalSupply(), 1);
        assertEq(op.balanceOf(minter), 1);
        assertEq(op.tokenIdNext(), 2);
    }

    function testSetupToken() public {
        assertEq(op.tokenByIndex(0), 1);
        assertEq(op.tokenOfOwnerByIndex(minter, 0), 1);
        assertEq(op.ownerOf(1), minter);
        assertEq(op.tokenURI(1), _TOKEN_URI);
    }

    function testSetupPrice() public {
        assertEq(op.tokenPrice(1), 0);
        // assertEq(op.floorPrice(), 0);
    }

    function testSetupRoyalties() public {
        (address receiver, uint256 royalties) = op.royaltyInfo(1, 1);
        assertEq(receiver, address(0));
        assertEq(royalties, 0);
    }
}
