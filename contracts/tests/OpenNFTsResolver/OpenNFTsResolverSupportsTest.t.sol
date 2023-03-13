// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "src/interfaces/IOpenNFTsResolver.sol";
import "src/OpenNFTsResolver.sol";

abstract contract OpenNFTsResolverSupportsTest is Test {
    address private _resolver;
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsResolverSupports() public {
        _resolver = constructorTest(_owner);
    }

    function testOpenNFTsResolverCheckErcInterfaces() public {
        bool[11] memory expected = [false, true, false, false, false, false, false, false, false, true, false];

        bool[] memory checks = IOpenChecker(_resolver).checkErcInterfaces(_resolver);

        for (uint256 i = 0; i < expected.length; i++) {
            assertEq(checks[i], expected[i]);
        }
    }

    function testOpenNFTsResolverCheckSupportedInterfaces() public {
        bytes4[8] memory ids = [
            type(IOpenCloneable).interfaceId,
            type(IOpenMarketable).interfaceId,
            type(IOpenNFTs).interfaceId,
            type(IOpenNFTsResolver).interfaceId,
            type(IOpenPauseable).interfaceId,
            type(IOpenChecker).interfaceId,
            type(IERC721TokenReceiver).interfaceId,
            0xffffffff
        ];
        bool[8] memory expected = [false, false, false, true, false, true, false, false];

        bytes4[] memory interfaceIds = new bytes4[](8);
        for (uint256 i = 0; i < ids.length; i++) {
            interfaceIds[i] = ids[i];
        }

        bool[] memory checks = IOpenChecker(_resolver).checkSupportedInterfaces(_resolver, false, interfaceIds);

        for (uint256 i = 0; i < ids.length; i++) {
            console.log("testOpenNFTsResolverCheckErcInterfaces ~ i", i);
            assertEq(checks[i], expected[i]);
        }
    }
}
