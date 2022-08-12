// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenNFTsV4.sol";
import "../../templates/NFTsResolver.sol";

import {IOpenNFTs as IOpenNFTsOld} from "../../interfaces/IOpenNFTs.old.sol";

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
        // bytes4[15] memory ids = [
        //     type(IOpenChecker).interfaceId,
        //     type(IOpenCloneable).interfaceId,
        //     type(IOpenMarketable).interfaceId,
        //     type(IOpenNFTsOld).interfaceId,
        //     type(IOpenNFTs).interfaceId,
        //     type(IOpenNFTsV4).interfaceId,
        //     type(IOpenPauseable).interfaceId
        // ];

        /// 0xffffffff :  O Invalid
        /// 0x01ffc9a7 :  1 ERC165
        ///
        /// 0x80ac58cd :  2 ERC721
        /// 0x5b5e139f :  3 ERC721Metadata
        /// 0x780e9d63 :  4 ERC721Enumerable
        /// 0x150b7a02 :  5 ERC721TokenReceiver
        ///
        /// 0xd9b67a26 :  6 ERC1155
        /// 0x0e89341c :  7 ERC1155MetadataURI
        /// 0x4e2312e0 :  8 ERC1155TokenReceiver
        ///
        /// 0x7f5828d0 :  9 ERC173
        /// 0x2a55205a : 10 ERC2981
        bool[11] memory expected = [false, true, true, true, true, false, false, false, false, true, true];

        // bytes4[] memory interfaceIds = new bytes4[](expected.length);
        // for (uint256 i = 0; i < ids.length; i++) {
        //     interfaceIds[i] = ids[i];
        // }

        NFTsResolver resolver = new NFTsResolver();
        bool[] memory checks = IOpenChecker(resolver).checkSupportedInterfaces(_collection);

        for (uint256 i = 0; i < checks.length; i++) {
            assertEq(checks[i], expected[i]);
        }
    }
}
