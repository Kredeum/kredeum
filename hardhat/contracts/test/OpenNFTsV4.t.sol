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

        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;

        op.initialize("OpenNFTsV4Test", "OPTEST", owner, options);

        startHoax(minter);
        tokenID0 = op.mint(_TOKEN_URI);
    }

    function testBuyOk() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        op.buy{value: 1.5 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), buyer);

        assertEq(buyer.balance, 9 ether);
        assertEq(address(op).balance, 0.99 ether);
        assertEq(random.balance, 0.01 ether);
    }

    function testBuyTwice() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        op.buy{value: 1 ether}(tokenID0);
        vm.expectRevert(bytes("Not to sell"));
        op.buy{value: 1 ether}(tokenID0);
    }

    function testBuyNotEnoughFunds() public {
        op.setTokenRoyalty(tokenID0, random, 100);
        op.setTokenPrice(tokenID0, 1 ether);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        vm.expectRevert(bytes("Not enough funds"));
        op.buy{value: 0.5 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), minter);

        assertEq(buyer.balance, 10 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(random.balance, 0 ether);
    }

    function testBuyNotToSell() public {
        op.setTokenPrice(tokenID0, 0);

        changePrank(buyer);
        deal(buyer, 10 ether);

        assertEq(op.ownerOf(tokenID0), minter);
        vm.expectRevert(bytes("Not to sell"));
        op.buy{value: 1 ether}(tokenID0);
        assertEq(op.ownerOf(tokenID0), minter);

        assertEq(buyer.balance, 10 ether);
        assertEq(address(op).balance, 0 ether);
        assertEq(random.balance, 0 ether);
    }

    function testSetTokenRoyaltyNoToken() public {
        vm.expectRevert(bytes("ERC721: owner query for nonexistent token"));
        op.setTokenRoyalty(notTokenID, random, 100);
    }

    function testSetTokenPriceNoToken() public {
        vm.expectRevert(bytes("ERC721: owner query for nonexistent token"));
        op.setTokenPrice(notTokenID, 1 ether);
    }

    function testRoyaltyInfoOverFlow() public {
        changePrank(owner);
        op.setDefaultRoyalty(minter, maxFee);

        op.royaltyInfo(tokenID0, maxPrice);
        vm.expectRevert(stdError.arithmeticError);
        op.royaltyInfo(tokenID0, maxPrice * 2);
    }

    function testRoyaltyInfo(uint256 price, uint96 fee) public {
        // Assume reasonable max price
        vm.assume(fee < maxFee);
        vm.assume(price < maxPrice);

        changePrank(owner);
        op.setDefaultRoyalty(minter, fee);

        (address creator, uint256 royalties) = op.royaltyInfo(tokenID0, price);
        assertEq(creator, minter);
        assertEq(royalties, (price * fee) / maxFee);
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
}
