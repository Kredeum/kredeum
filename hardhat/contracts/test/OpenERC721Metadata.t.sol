// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721MetadataTest is OpenNFTsTest {
    function testInitialize() public {
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        assertEq(opn.name(), "OpenNFTsTest");
        assertEq(opn.symbol(), "OPTEST");
    }

    function testInitializeTwice() public {
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        vm.expectRevert("Only once!");
        opn.initialize("OpenNFTsTest", "OPTEST", tester, options);
        assertEq(opn.name(), "OpenNFTsTest");
        assertEq(opn.symbol(), "OPTEST");
    }

    function testName() public {
        assertEq(op.name(), "OpenNFTsTest");
    }

    function testSymbol() public {
        assertEq(op.symbol(), "OPTEST");
    }

    function testURI() public {
        assertEq(op.tokenURI(tokenID0), _TOKEN_URI);
    }

    function testFull() public {
        opn.initialize("NAME_TEST", "SYMBOL_TEST", minter, options);
        assertEq(opn.name(), "NAME_TEST");
        assertEq(opn.symbol(), "SYMBOL_TEST");

        uint256 tokenID = opn.mint("URL_TEST");
        assertEq(opn.tokenURI(tokenID), "URL_TEST");
    }

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IERC721Metadata).interfaceId));
    }
}
