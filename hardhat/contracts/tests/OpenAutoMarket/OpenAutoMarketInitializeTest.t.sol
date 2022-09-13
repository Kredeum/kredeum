// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "../../interfaces/IOpenAutoMarket.sol";

abstract contract OpenAutoMarketInitializeTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);

    function constructorTest(address owner_, bool init_) public virtual returns (address);

    function setUpOpenAutoMarketInitialize() public {
        _collection = constructorTest(_owner, false);

        _options[0] = true;
    }

    function testInitializeName() public {
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        // assertEq(IERC721Metadata(_collection).name(), "OpenAutoMarketTest");
    }

    function testInitializeSymbol() public {
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        assertEq(IERC721Metadata(_collection).symbol(), "TEST");
    }

    function testInitializeOwner() public {
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        assertEq(IERC173(_collection).owner(), _owner);
    }

    function testInitializeOpen() public {
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        assertEq(IOpenAutoMarket(_collection).open(), true);
    }

    function testInitializeNotOpen() public {
        _options[0] = false;
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        assertEq(IOpenAutoMarket(_collection).open(), false);
    }

    function testFailInitializeTwice() public {
        IOpenAutoMarket(_collection).initialize("OpenAutoMarketTest", "TEST", _owner, 0, address(0), 0, _options);
        IOpenAutoMarket(_collection).initialize("OpenNFTsOldTestTwice", "OPTEST2", _tester, 0, address(0), 0, _options);
    }
}
