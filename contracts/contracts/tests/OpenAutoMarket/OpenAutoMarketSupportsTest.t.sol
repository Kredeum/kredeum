// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenAutoMarket.sol";
import "../../OpenNFTsResolver.sol";

abstract contract OpenAutoMarketSupportsTest is Test {
    OpenNFTsResolver private _resolver;
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenAutoMarketSupports() public {
        _collection = constructorTest(_owner);

        _resolver = new OpenNFTsResolver(_owner, address(this));
    }

    function testOpenAutoMarketCheckErcInterfaces() public {
        bool[11] memory expected = [false, true, true, true, true, false, false, false, false, true, true];

        bool[] memory checks = IOpenChecker(_resolver).checkErcInterfaces(_collection);

        for (uint256 i = 0; i < expected.length; i++) {
            assertEq(checks[i], expected[i]);
        }
    }

    function testOpenAutoMarketCheckSupportedInterfaces() public {
        bytes4[9] memory ids = [
            type(IOpenCloneable).interfaceId,
            type(IOpenMarketable).interfaceId,
            type(IOpenAutoMarket).interfaceId,
            type(IOpenNFTs).interfaceId,
            type(IOpenAutoMarket).interfaceId,
            type(IOpenPauseable).interfaceId,
            type(IOpenChecker).interfaceId,
            type(IERC721TokenReceiver).interfaceId,
            0xffffffff
        ];
        bool[9] memory expected = [true, true, true, true, true, true, false, false, false];

        bytes4[] memory interfaceIds = new bytes4[](9);
        for (uint256 i = 0; i < ids.length; i++) {
            interfaceIds[i] = ids[i];
        }

        bool[] memory checks = IOpenChecker(_resolver).checkSupportedInterfaces(_collection, false, interfaceIds);

        for (uint256 i = 0; i < ids.length; i++) {
            console.log("testOpenAutoMarketCheckErcInterfaces ~ i", i);
            assertEq(checks[i], expected[i]);
        }
    }
}
