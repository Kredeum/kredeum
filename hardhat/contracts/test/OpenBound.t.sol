// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";
import "../new/OpenBound.sol";
import "../interfaces/IERC1155.sol";

contract OpenBoundForgeTest is Test {
    OpenBound public ob;

    constructor() {}

    function setUp() public {
        ob = new OpenBound("OpenBoundTest", "OBTEST", 0);
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
        ob.mint(tokenID);
        assertEq(ob.totalSupply(), 1);
    }

    function testFailAll(uint256 tokenID) public view {
        ob.tokenURI(tokenID);
        ob.tokenByIndex(tokenID);
        ob.tokenOfOwnerByIndex(msg.sender, tokenID);
    }

    function testRevertTokenURI(uint256 tokenID) public {
        vm.expectRevert(bytes("NFT doesn't exists"));
        ob.tokenURI(tokenID);
    }

    function testRevertTokenByIndex(uint256 tokenID) public {
        vm.expectRevert(bytes("Invalid index"));
        ob.tokenByIndex(tokenID);
    }

    function testRevertTokenOfOwnerByIndex(uint256 tokenID) public {
        vm.expectRevert(bytes("Invalid index"));
        ob.tokenOfOwnerByIndex(msg.sender, tokenID);
    }
}
