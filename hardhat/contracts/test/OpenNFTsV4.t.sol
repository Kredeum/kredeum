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

    address bond = address(0x007);
    string private constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    uint96 maxFee = 10000;
    uint256 maxPrice = uint256(((2**256) - 1)) / maxFee;

    function setUp() public {
        op = new OpenNFTsV4();

        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;

        op.initialize("OpenNFTsV4Test", "OPTEST", bond, options);
        op.mintOpenNFT(bond, _TOKEN_URI);
    }

    function testInterfaceIds() public {
        assertTrue(op.supportsInterface(type(IERC165).interfaceId));
        assertTrue(op.supportsInterface(type(IERC2981).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721Enumerable).interfaceId));
        assertTrue(op.supportsInterface(type(IERC721Metadata).interfaceId));
        assertTrue(op.supportsInterface(type(IOpenNFTsV4).interfaceId));

        assertFalse(op.supportsInterface(type(IERC1155).interfaceId));
    }

    function testRoyaltyInfoOverFlow() public {
        op.setDefaultRoyalty(bond, maxFee);

        op.royaltyInfo(0, maxPrice);
        vm.expectRevert(stdError.arithmeticError);
        op.royaltyInfo(0, maxPrice * 2);
    }

    function testRoyaltyInfo(uint256 price, uint96 fee) public {
        // Assume reasonable max price
        vm.assume(fee < maxFee);
        vm.assume(price < maxPrice);

        op.setDefaultRoyalty(bond, fee);

        (address creator, uint256 royalties) = op.royaltyInfo(0, price);
        assertEq(creator, bond);
        assertEq(royalties, (price * fee) / maxFee);
    }
}
