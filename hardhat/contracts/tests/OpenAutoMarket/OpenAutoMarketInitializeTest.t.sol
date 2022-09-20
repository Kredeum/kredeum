// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
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
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        assertEq(IERC721Metadata(_collection).name(), "OpenAutoMarketTest");
    }

    function testInitializeSymbol() public {
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        assertEq(IERC721Metadata(_collection).symbol(), "TEST");
    }

    function testInitializeOwner() public {
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        assertEq(IERC173(_collection).owner(), _owner);
    }

    function testInitializeOpen() public {
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        assertEq(IOpenAutoMarket(_collection).open(), true);
    }

    function testInitializeNotOpen() public {
        _options[0] = false;
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        assertEq(IOpenAutoMarket(_collection).open(), false);
    }

    function testFailInitializeTwice() public {
        IOpenCloneable(_collection).initialize(
            "OpenAutoMarketTest",
            "TEST",
            _owner,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
        IOpenCloneable(_collection).initialize(
            "OpenNFTsOldTestTwice",
            "OPTEST2",
            _tester,
            abi.encode(abi.encode(0, address(0), 0, _options), address(0), 0)
        );
    }
}
