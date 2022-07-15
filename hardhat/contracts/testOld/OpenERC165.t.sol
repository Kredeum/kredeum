// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC165Test is OpenNFTsOldTest {
    function testERC165() public {
        assertTrue(op.supportsInterface(type(IERC165).interfaceId));
        assertFalse(op.supportsInterface(0xffffffff));
    }

    function testERC721() public {
        assertTrue(op.supportsInterface(type(IERC721).interfaceId));
    }

    function testERC721Enumerable() public {
        assertTrue(op.supportsInterface(type(IERC721Enumerable).interfaceId));
    }

    function testERC721Metadata() public {
        assertTrue(op.supportsInterface(type(IERC721Metadata).interfaceId));
    }

    function testER2981() public {
        assertTrue(op.supportsInterface(type(IERC2981).interfaceId));
    }

    function testERC173() public {
        assertTrue(op.supportsInterface(type(IERC173).interfaceId));
    }

    function testPausable() public {
        assertTrue(op.supportsInterface(type(IOpenPausable).interfaceId));
    }

    function testPriceable() public {
        assertTrue(op.supportsInterface(type(IOpenPriceable).interfaceId));
    }

    function testNot() public {
        assertFalse(op.supportsInterface(type(IERC1155).interfaceId));
    }

    function testOpenNFTsVN() public {
        assertTrue(op.supportsInterface(opId));
        assertTrue(opn.supportsInterface(opId));
    }

    function testSupportsInterface() public {
        assertTrue(op.supportsInterface(type(IERC165).interfaceId));
    }
}
