// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenFactoryV3.sol";
import "../../next/OpenNFTsV4.sol";
import "../../next/OpenAutoMarket.sol";

abstract contract OpenFactoryV3CloneTest is Test {
    address private _factory;
    address private _template;
    address private _clone;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenFactoryV3Clone() public {
        _factory = constructorTest(_owner);
    }

    function testOpenFactoryV3CloneOpenNFTsV4() public {
        bool[] memory options = new bool[](1);
        options[0] = true;

        _clone = OpenFactoryV3(_factory).clone("NFT test", "NFT", "OpenNFTsV4", abi.encode(options));

        assertTrue(OpenNFTsV4(_clone).initialized());
        assertEq(OpenNFTsV4(_clone).name(), "NFT test");
    }

    function testOpenFactoryV3CloneOpenAutoMarket() public {
        bool[] memory options = new bool[](1);
        options[0] = true;

        _clone = OpenFactoryV3(_factory).clone(
            "NFT test",
            "NFT",
            "OpenAutoMarket",
            abi.encode(42000000000, _tester, 420, options)
        );
        assertEq(OpenAutoMarket(payable(_clone)).name(), "NFT test");
        assertEq(OpenAutoMarket(payable(_clone)).symbol(), "NFT");

        assertEq(OpenAutoMarket(payable(_clone)).defaultPrice(), 42000000000);

        (address receiver, uint96 fee) = OpenAutoMarket(payable(_clone)).getDefaultRoyalty();
        assertEq(receiver, _tester);
        assertEq(fee, 420);
    }
}
