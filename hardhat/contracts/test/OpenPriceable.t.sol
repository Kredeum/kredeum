// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC721.sol";
import "../interfaces/IERC2981.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IOpenPriceable.sol";

abstract contract PriceableTest is Test {
    address private _contract;
    address private owner = address(0x1);
    address private minter = address(0x2);
    address private tester = address(0x4);
    uint256 private _tokenID0;
    uint256 notTokenID = 42;

    uint96 maxFee = 10000;
    uint256 maxPrice = uint256(((2**256) - 1)) / maxFee;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256);

    function setRoyaltyTest(
        address collection_,
        address receiver_,
        uint96 fee_
    ) public virtual returns (uint256 tokenID_);

    function setUpPriceable() public {
        _contract = constructorTest(owner);

        _tokenID0 = setRoyaltyTest(_contract, minter, 420);
    }

    function testSetDefaultRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        uint256 tokenID = mintTest(_contract, owner);

        changePrank(owner);
        IOpenPriceable(_contract).setDefaultRoyalty(minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(tokenID, price);
        assertEq(receiver, minter);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSetTokenRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price != 0);
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        assertEq(IERC721(_contract).ownerOf(_tokenID0), minter);
        changePrank(minter);
        IOpenPriceable(_contract).setTokenRoyalty(_tokenID0, tester, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(_tokenID0, price);
        assertEq(receiver, tester);
        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSetTokenRoyaltyNoToken() public {
        vm.expectRevert(bytes("Invalid token ID"));
        IOpenPriceable(_contract).setTokenRoyalty(notTokenID, tester, 100);
    }

    function testSetTokenPrice(uint256 price) public {
        vm.assume(price < 2**128);

        changePrank(minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0, price);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), price);
    }

    function testSetTokenPriceFromDefault(uint256 price) public {
        vm.assume(price < 2**128);

        changePrank(minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), 0);

        changePrank(owner);
        IOpenPriceable(_contract).setDefaultPrice(price);

        changePrank(minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), price);
    }

    function testSetDefaultPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);

        changePrank(owner);
        vm.expectRevert("Too expensive");
        IOpenPriceable(_contract).setDefaultPrice(price);
    }

    function testSetTokenPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);

        changePrank(minter);
        vm.expectRevert("Too expensive");
        IOpenPriceable(_contract).setTokenPrice(_tokenID0, price);
    }

    function testSetTokenPriceNoToken() public {
        changePrank(minter);
        vm.expectRevert(bytes("Invalid token ID"));
        IOpenPriceable(_contract).setTokenPrice(notTokenID, 1 ether);
    }

    function testRoyaltyInfoCalculation(uint256 price, uint96 fee) public {
        vm.assume(price < 2**128);
        vm.assume(fee < maxFee);

        uint256 tokenID = mintTest(_contract, owner);

        changePrank(owner);
        IOpenPriceable(_contract).setDefaultRoyalty(minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(tokenID, price);
        assertEq(receiver, minter);

        assertEq(royalties, (price * fee) / maxFee);
    }

    function testSupportsInterface() public {
        assertTrue(IERC165(_contract).supportsInterface(type(IOpenPriceable).interfaceId));
    }
}
