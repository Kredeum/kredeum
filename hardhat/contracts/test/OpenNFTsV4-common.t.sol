// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTsV4.t.sol";

contract OpenNFTsV4TestCommon is OpenNFTsV4Test {
    function testERC165() public {
        assertTrue(op.supportsInterface(type(IERC165).interfaceId));
        assertFalse(op.supportsInterface(0xffffffff));
    }

    function testERC173() public {
        assertTrue(op.supportsInterface(type(IERC173).interfaceId));
    }

    function testER2981() public {
        assertTrue(op.supportsInterface(type(IERC2981).interfaceId));
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

    function testOpenNFTsV4() public {
        assertTrue(op.supportsInterface(type(IOpenNFTsV4).interfaceId));
    }

    function testFalse() public {
        assertFalse(op.supportsInterface(type(IERC1155).interfaceId));
    }
}
