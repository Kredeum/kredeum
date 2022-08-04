// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenNFTsV4.sol";
import {IOpenNFTs as IOpenNFTsOld} from "../../interfaces/IOpenNFTs.sol";

abstract contract OpenNFTsV4SupportsTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsV4Supports() public {
        _collection = constructorTest(_owner);
    }

    function testOpenNFTsCheckSupportedInterfaces() public {
        bytes4[15] memory ids = [
            type(IERC165).interfaceId,
            type(IERC173).interfaceId,
            type(IERC2981).interfaceId,
            type(IERC721).interfaceId,
            type(IERC721Enumerable).interfaceId,
            type(IERC721Metadata).interfaceId,
            type(IOpenChecker).interfaceId,
            type(IOpenCloneable).interfaceId,
            type(IOpenMarketable).interfaceId,
            type(IOpenNFTsOld).interfaceId,
            type(IOpenNFTs).interfaceId,
            type(IOpenNFTsV4).interfaceId,
            type(IOpenPauseable).interfaceId,
            type(IERC721TokenReceiver).interfaceId,
            0xffffffff
        ];
        bool[15] memory expected = [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false
        ];

        bytes4[] memory interfaceIds = new bytes4[](15);
        for (uint256 i = 0; i < ids.length; i++) {
            interfaceIds[i] = ids[i];
        }

        bool[] memory checks = IOpenChecker(_collection).checkSupportedInterfaces(_collection, interfaceIds);

        for (uint256 i = 0; i < ids.length; i++) {
            assertEq(checks[i], expected[i]);
        }
    }
}
