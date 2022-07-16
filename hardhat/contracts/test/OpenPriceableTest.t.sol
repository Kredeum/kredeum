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
    address private _owner = address(0x1);
    address private _minter = address(0x2);
    address private _tester = address(0x4);
    uint256 private _tokenID0;
    uint256 private _notTokenID = 42;

    uint96 private _maxFee = 10000;

    // uint256 private maxPrice = uint256(((2**256) - 1)) / _maxFee;

    function constructorTest(address owner_) public virtual returns (address);

    function mintTest(address collection_, address minter_) public virtual returns (uint256);

    function setRoyaltyTest(
        address collection_,
        address receiver_,
        uint96 fee_
    ) public virtual returns (uint256 tokenID_);

    function setUpPriceable() public {
        _contract = constructorTest(_owner);

        _tokenID0 = setRoyaltyTest(_contract, _minter, 420);
    }

    function testSetDefaultRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        uint256 tokenID = mintTest(_contract, _owner);

        changePrank(_owner);
        IOpenPriceable(_contract).setDefaultRoyalty(_minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(tokenID, price);
        assertEq(receiver, _minter);
        assertEq(royalties, (price * fee) / _maxFee);
    }

    function testSetTokenRoyalty(uint96 fee, uint256 price) public {
        vm.assume(price != 0);
        vm.assume(price < 2**128);
        vm.assume(fee < 10000);

        assertEq(IERC721(_contract).ownerOf(_tokenID0), _minter);
        changePrank(_minter);
        IOpenPriceable(_contract).setTokenRoyalty(_tokenID0, _tester, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(_tokenID0, price);
        assertEq(receiver, _tester);
        assertEq(royalties, (price * fee) / _maxFee);
    }

    function testSetTokenRoyaltyNoToken() public {
        vm.expectRevert(bytes("Invalid token ID"));
        IOpenPriceable(_contract).setTokenRoyalty(_notTokenID, _tester, 100);
    }

    function testSetTokenPrice(uint256 price) public {
        vm.assume(price < 2**128);

        changePrank(_minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0, price);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), price);
    }

    function testSetTokenPriceFromDefault(uint256 price) public {
        vm.assume(price < 2**128);

        changePrank(_minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), 0);

        changePrank(_owner);
        IOpenPriceable(_contract).setDefaultPrice(price);

        changePrank(_minter);
        IOpenPriceable(_contract).setTokenPrice(_tokenID0);
        assertEq(IOpenPriceable(_contract).tokenPrice(_tokenID0), price);
    }

    function testSetDefaultPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);

        changePrank(_owner);
        vm.expectRevert("Too expensive");
        IOpenPriceable(_contract).setDefaultPrice(price);
    }

    function testSetTokenPriceTooExpensive(uint256 price) public {
        vm.assume(price > 2**128);

        changePrank(_minter);
        vm.expectRevert("Too expensive");
        IOpenPriceable(_contract).setTokenPrice(_tokenID0, price);
    }

    function testSetTokenPriceNoToken() public {
        changePrank(_minter);
        vm.expectRevert(bytes("Invalid token ID"));
        IOpenPriceable(_contract).setTokenPrice(_notTokenID, 1 ether);
    }

    function testRoyaltyInfoCalculation(uint256 price, uint96 fee) public {
        vm.assume(price < 2**128);
        vm.assume(fee < _maxFee);

        uint256 tokenID = mintTest(_contract, _owner);

        changePrank(_owner);
        IOpenPriceable(_contract).setDefaultRoyalty(_minter, fee);

        (address receiver, uint256 royalties) = IERC2981(_contract).royaltyInfo(tokenID, price);
        assertEq(receiver, _minter);

        assertEq(royalties, (price * fee) / _maxFee);
    }

    function testSupportsInterface() public {
        assertTrue(IERC165(_contract).supportsInterface(type(IOpenPriceable).interfaceId));
    }
}
