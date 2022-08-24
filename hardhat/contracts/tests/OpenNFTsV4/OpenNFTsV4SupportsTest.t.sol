// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenNFTsV4.sol";
import "../../next/OpenNFTsResolver.sol";

abstract contract OpenNFTsV4SupportsTest is Test {
    OpenNFTsResolver private _resolver;
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsV4Supports() public {
        _collection = constructorTest(_owner);

        _resolver = new OpenNFTsResolver(_owner, address(this));
    }

    function testOpenNFTsV4CheckErcInterfaces() public {
        bool[11] memory expected = [false, true, true, true, true, false, false, false, false, true, true];

        bool[] memory checks = IOpenChecker(_resolver).checkErcInterfaces(_collection);

        for (uint256 i = 0; i < expected.length; i++) {
            assertEq(checks[i], expected[i]);
        }
    }

    function testOpenNFTsV4CheckSupportedInterfaces() public {
        bytes4[8] memory ids = [
            type(IOpenCloneable).interfaceId,
            type(IOpenMarketable).interfaceId,
            type(IOpenNFTs).interfaceId,
            type(IOpenNFTsV4).interfaceId,
            type(IOpenPauseable).interfaceId,
            type(IOpenChecker).interfaceId,
            type(IERC721TokenReceiver).interfaceId,
            0xffffffff
        ];
        bool[8] memory expected = [true, true, true, true, true, false, false, false];

        bytes4[] memory interfaceIds = new bytes4[](8);
        for (uint256 i = 0; i < ids.length; i++) {
            interfaceIds[i] = ids[i];
        }

        bool[] memory checks = IOpenChecker(_resolver).checkSupportedInterfaces(_collection, false, interfaceIds);

        for (uint256 i = 0; i < ids.length; i++) {
            console.log("testOpenNFTsV4CheckErcInterfaces ~ i", i);
            assertEq(checks[i], expected[i]);
        }
    }
}
