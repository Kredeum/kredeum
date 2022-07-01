// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IERC2981.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC1155.sol";

import "../dev/OpenNFTsV4.sol";

contract OpenNFTsV4Test is Test {
    OpenNFTsV4 public op;

    address owner = address(0x1);
    address minter = address(0x2);
    address buyer = address(0x3);
    address random = address(0x4);

    string private constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    uint96 maxFee = 10000;
    uint256 maxPrice = uint256(((2**256) - 1)) / maxFee;
    uint256 tokenID0;
    uint256 notTokenID = 42;

    function setUp() public {
        op = new OpenNFTsV4();

        bool[] memory options = new bool[](1);
        options[0] = true;

        op.initialize("OpenNFTsV4Test", "OPTEST", owner, options);

        startHoax(minter);
        tokenID0 = op.mint(_TOKEN_URI);
    }

    function testSetupContract() public {
        assertEq(op.name(), "OpenNFTsV4Test");
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
        assertEq(op.floorPrice(), 0);
    }

    function testSetupRoyalties() public {
        (address receiver, uint256 royalties) = op.royaltyInfo(1, 1);
        assertEq(receiver, address(0));
        assertEq(royalties, 0);
    }
}
