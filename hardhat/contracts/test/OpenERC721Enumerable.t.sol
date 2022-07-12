// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenERC721EnumerableTest is OpenNFTsTest {
    function testAll() public {}

    function testTotalSupply() public {}

    function testTokenByIndex() public {}

    function testTokenOfOwnerByIndex() public {}

    function testSupporstInterface() public {
        assertTrue(op.supportsInterface(type(IERC721Enumerable).interfaceId));
    }
}
