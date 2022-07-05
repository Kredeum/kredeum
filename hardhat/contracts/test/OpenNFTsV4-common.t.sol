// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTsV4.t.sol";

contract OpenNFTsV4TestCommon is OpenNFTsV4Test {
    function testInterfaceIds() public {
        assertTrue(op.supportsInterface(type(IERC165).interfaceId));
        assertTrue(op.supportsInterface(type(IERC173).interfaceId));
        assertTrue(op.supportsInterface(type(IERC2981).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721Enumerable).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721Metadata).interfaceId));
        assertTrue(op.supportsInterface(type(IOpenNFTsV4).interfaceId));

        assertFalse(op.supportsInterface(type(IERC1155).interfaceId));
    }
}
