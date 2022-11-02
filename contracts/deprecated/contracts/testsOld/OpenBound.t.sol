// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/contracts/Test.sol";
import "../next/OpenBound.sol";
import "OpenNFTs/contracts/interfaces/IERC1155.sol";

contract OpenBoundForgeTest is Test {
    OpenBound public ob;
    address owner = address(0x1);

    constructor() {}

    function setUp() public {
        ob = new OpenBound();
        ob.initialize("OpenBoundTest", "OBTEST", owner, 0);
    }

    function testInterfaceIds() public {
        assertTrue(ob.supportsInterface(type(IERC165).interfaceId));
        assertTrue(ob.supportsInterface(type(IERC721Enumerable).interfaceId));
        assertTrue(ob.supportsInterface(type(IERC721).interfaceId));
        assertTrue(ob.supportsInterface(type(IERC721Metadata).interfaceId));
        assertTrue(ob.supportsInterface(type(IOpenBound).interfaceId));

        assertFalse(ob.supportsInterface(type(IERC1155).interfaceId));
    }

    function testMint(uint256 tokenID) public {
        assertEq(ob.totalSupply(), 0);

        changePrank(owner);
        ob.mint(tokenID);

        assertEq(ob.totalSupply(), 1);
    }

    function testFailAll(uint256 tokenID) public view {
        ob.tokenURI(tokenID);
        ob.tokenByIndex(tokenID);
        ob.tokenOfOwnerByIndex(msg.sender, tokenID);
    }

    function testFailTokenURI(uint256 tokenID) public view {
        ob.tokenURI(tokenID);
    }

    function testFailTokenByIndex(uint256 tokenID) public view {
        ob.tokenByIndex(tokenID);
    }

    function testFailTokenOfOwnerByIndex(uint256 tokenID) public view {
        ob.tokenOfOwnerByIndex(msg.sender, tokenID);
    }
}
