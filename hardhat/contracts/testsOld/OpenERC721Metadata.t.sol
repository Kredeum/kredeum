// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721MetadataTest is OpenNFTsOldTest {
    function testInitialize() public {
        changePrank(owner);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, 0, address(0), 0, options);

        assertEq(opn.name(), "OpenNFTsOldTest");
        assertEq(opn.symbol(), "OPTEST");
    }

    function testFailInitializeTwice() public {
        changePrank(owner);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, 0, address(0), 0, options);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, 0, address(0), 0, options);
    }

    function testName() public {
        assertEq(op.name(), "OpenNFTsOldTest");
    }

    function testSymbol() public {
        assertEq(op.symbol(), "OPTEST");
    }

    function testURI() public {
        assertEq(op.tokenURI(tokenID0), _TOKEN_URI);
    }

    function testFull() public {
        changePrank(minter);
        opn.initialize("NAME_TEST", "SYMBOL_TEST", minter, 0, address(0), 0, options);

        assertEq(opn.name(), "NAME_TEST");
        assertEq(opn.symbol(), "SYMBOL_TEST");

        uint256 tokenID = opn.mint("URL_TEST");
        assertEq(opn.tokenURI(tokenID), "URL_TEST");
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IERC721Metadata).interfaceId));
    }
}
