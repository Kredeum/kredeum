// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../interfaces/IERC173.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC2981.sol";
import "../interfaces/IOpenNFTsV4.sol";
import "../interfaces/IOpenMarketable.sol";
import "../templates/OpenNFTsV4.sol";

abstract contract OpenNFTsInitializeTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function setUpOpenNFTsInitialize() public {
        _collection = address(new OpenNFTsV4());
        _options[0] = true;
    }

    function testInitializeName() public {
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        assertEq(IERC721Metadata(_collection).name(), "OpenERC721Test");
    }

    function testInitializeSymbol() public {
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        assertEq(IERC721Metadata(_collection).symbol(), "TEST");
    }

    function testInitializeOwner() public {
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        assertEq(IERC173(_collection).owner(), _owner);
    }

    function testInitializeOpen() public {
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        assertEq(IOpenNFTsV4(_collection).open(), true);
    }

    function testInitializeNotOpen() public {
        _options[0] = false;
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        assertEq(IOpenNFTsV4(_collection).open(), false);
    }

    function testFailInitializeTwice() public {
        IOpenNFTsV4(_collection).initialize("OpenERC721Test", "TEST", _owner, _options);
        IOpenNFTsV4(_collection).initialize("OpenNFTsOldTestTwice", "OPTEST2", _tester, _options);
    }
}
