// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsV4} from "src/OpenNFTsV4.sol";
import {OpenAutoMarket} from "src/OpenAutoMarket.sol";

import {IOpenReceiverInfos} from "OpenNFTs/contracts/interfaces/IOpenReceiverInfos.sol";

abstract contract OpenNFTsFactoryV3CloneTest is Test, IOpenReceiverInfos {
    address internal _factory;
    address internal _template;
    address internal _clone;
    address internal _owner = address(0x1);
    address internal _minter = address(0x12);
    address internal _buyer = address(0x13);
    address internal _tester = address(0x4);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsFactoryV3Clone() public {
        _factory = constructorTest(_owner);
    }

    function testOpenNFTsFactoryV3CloneOpenNFTsV4() public {
        bool[] memory options = new bool[](1);
        options[0] = true;

        _clone =
            OpenNFTsFactoryV3(_factory).clone("NFT test", "NFT", "OpenNFTsV4", abi.encode(0, address(0), 0, options));

        assertTrue(OpenNFTsV4(_clone).initialized());
        assertEq(OpenNFTsV4(_clone).name(), "NFT test");
    }

    function testOpenNFTsFactoryV3CloneOpenAutoMarket() public {
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = false;

        _clone = OpenNFTsFactoryV3(_factory).clone(
            "NFT test", "NFT", "OpenAutoMarket", abi.encode(42_000_000_000, _tester, 420, options)
        );
        assertEq(OpenAutoMarket(payable(_clone)).name(), "NFT test");
        assertEq(OpenAutoMarket(payable(_clone)).symbol(), "NFT");

        assertEq(OpenAutoMarket(payable(_clone)).getMintPrice(), 42_000_000_000);

        ReceiverInfos memory receiver = OpenAutoMarket(payable(_clone)).getDefaultRoyalty();
        assertEq(receiver.account, _tester);
        assertEq(receiver.fee, 420);
    }
}
